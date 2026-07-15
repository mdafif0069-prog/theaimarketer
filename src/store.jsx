import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { initialState, initialForm } from './data/seed.js';
import { ORDER, PLATFORMS, TODAY } from './constants.js';
import { validateFiles } from './lib/media.js';
import { assistantComplete, buildAssistantSystem, refineCaption } from './lib/ai.js';
import { isSupabaseEnabled } from './lib/supabase.js';
import { getSession, onAuthChange, signOut as authSignOut } from './lib/auth.js';
import * as repo from './api/workspace.js';

const HubContext = createContext(null);

export function useHub() {
  const ctx = useContext(HubContext);
  if (!ctx) throw new Error('useHub must be used within <HubProvider>');
  return ctx;
}

const APPROVERS = new Set(['Admin', 'Approver']);

export function HubProvider({ children }) {
  const [state, setStateRaw] = useState(() => ({
    ...initialState,
    // Phase 2 runtime fields (unused in demo mode):
    backend: isSupabaseEnabled,
    session: null,
    currentUser: null,
    loading: isSupabaseEnabled, // block UI until first load when wired to a backend
    notice: null,
  }));

  const setState = useCallback((patch) => {
    setStateRaw((prev) => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }));
  }, []);

  const stateRef = useRef(state);
  stateRef.current = state;

  const notice = useCallback((msg) => {
    setStateRaw((s) => ({ ...s, notice: msg }));
    if (msg) setTimeout(() => setStateRaw((s) => (s.notice === msg ? { ...s, notice: null } : s)), 4200);
  }, []);

  const fail = useCallback((label, err) => {
    // Keep the optimistic UI but surface that the save didn't reach the backend.
    console.error(label, err);
    notice(label + ' — ' + (err?.message || 'request failed'));
  }, [notice]);

  const setForm = useCallback(
    (patch) => setStateRaw((s) => ({ ...s, form: { ...s.form, ...patch } })),
    [],
  );

  // --- Data load (backend mode) ---
  const loadWorkspace = useCallback(async () => {
    try {
      const { team, posts, connections, settings } = await repo.loadWorkspace();
      setStateRaw((s) => {
        const email = s.session?.user?.email;
        const currentUser = email ? team.find((m) => m.email === email) || null : null;
        return {
          ...s,
          team: team.length ? team : s.team,
          posts,
          connections,
          currentUser,
          loading: false,
          ...(settings ? { ...settings, form: { ...s.form, requiresApproval: settings.wsApproval, reminder: settings.wsReminder } } : {}),
        };
      });
    } catch (err) {
      fail('Could not load workspace', err);
      setStateRaw((s) => ({ ...s, loading: false }));
    }
  }, [fail]);

  // Auth session + initial load.
  useEffect(() => {
    if (!isSupabaseEnabled) return;
    let active = true;
    getSession().then((session) => {
      if (!active) return;
      setStateRaw((s) => ({ ...s, session }));
      if (session) loadWorkspace();
      else setStateRaw((s) => ({ ...s, loading: false }));
    });
    const unsub = onAuthChange((session) => {
      setStateRaw((s) => ({ ...s, session, loading: Boolean(session), currentUser: session ? s.currentUser : null }));
      if (session) loadWorkspace();
    });
    return () => {
      active = false;
      unsub();
    };
  }, [loadWorkspace]);

  const signOut = useCallback(async () => {
    await authSignOut();
    setStateRaw((s) => ({ ...s, session: null, currentUser: null }));
  }, []);

  const openComposer = useCallback((iso) => {
    setStateRaw((s) => ({ ...s, modalOpen: true, aiCaption: null, form: { ...s.form, date: iso, title: '', media: [] } }));
  }, []);

  const closeModal = useCallback(() => setStateRaw((s) => ({ ...s, modalOpen: false })), []);

  // --- Composer save ---
  const savePost = useCallback(
    async (status) => {
      const S = stateRef.current;
      if (!(S.form.title || '').trim()) {
        setStateRaw((s) => ({ ...s, modalOpen: false }));
        return;
      }
      setStateRaw((s) => ({ ...s, modalOpen: false }));
      if (S.backend) {
        try {
          const created = await repo.createPost(S.form, status, S.team);
          setStateRaw((s) => ({ ...s, posts: s.posts.concat([created]) }));
        } catch (err) {
          fail('Post not saved', err);
        }
      } else {
        setStateRaw((s) => ({
          ...s,
          posts: s.posts.concat([
            {
              id: Date.now(),
              date: s.form.date,
              time: s.form.time,
              platform: s.form.platform,
              title: s.form.title,
              status,
              assignee: s.form.assignee,
              campaign: s.form.campaign,
            },
          ]),
        }));
      }
    },
    [fail],
  );

  // --- Kanban advance (with approver-only gate on review -> scheduled) ---
  const advancePost = useCallback(
    (id) => {
      const S = stateRef.current;
      const post = S.posts.find((p) => p.id === id);
      if (!post) return;
      const next = ORDER[ORDER.indexOf(post.status) + 1];
      if (!next) return;

      if (post.status === 'review' && next === 'scheduled' && S.backend) {
        const perm = S.currentUser?.perm;
        if (!APPROVERS.has(perm)) {
          notice('Only an approver (Nabil, CMO) can approve posts for scheduling.');
          return;
        }
      }

      setStateRaw((s) => ({ ...s, posts: s.posts.map((p) => (p.id === id ? { ...p, status: next } : p)) }));
      if (S.backend) repo.updatePostStatus(id, next).catch((err) => fail('Status not saved', err));
    },
    [fail, notice],
  );

  // --- Media ---
  const addMedia = useCallback((e) => {
    const files = e.target.files;
    if (!files || !files.length) return;
    const items = validateFiles(files, stateRef.current.form.platform);
    e.target.value = '';
    setStateRaw((s) => ({ ...s, form: { ...s.form, media: s.form.media.concat(items) } }));
  }, []);

  const removeMedia = useCallback((mid) => {
    setStateRaw((s) => ({ ...s, form: { ...s.form, media: s.form.media.filter((m) => m.id !== mid) } }));
  }, []);

  // --- AI assistant ---
  const sendAi = useCallback(async (q) => {
    const S = stateRef.current;
    const question = (typeof q === 'string' ? q : S.aiInput).trim();
    if (!question || S.aiBusy) return;
    const history = S.aiMsgs.map((m) => ({ role: m.role, content: m.text }));
    setStateRaw((s) => ({ ...s, aiBusy: true, aiInput: '', aiMsgs: s.aiMsgs.concat([{ role: 'user', text: question }]) }));
    let answer;
    try {
      answer = await assistantComplete({
        system: buildAssistantSystem(S.posts),
        messages: history.concat([{ role: 'user', content: question }]),
        posts: S.posts,
      });
    } catch {
      answer = 'AI is unavailable right now — please try again in a moment.';
    }
    setStateRaw((s) => ({ ...s, aiBusy: false, aiMsgs: s.aiMsgs.concat([{ role: 'assistant', text: answer }]) }));
  }, []);

  const doRefineCaption = useCallback(async () => {
    const S = stateRef.current;
    const f = S.form;
    if (S.refineBusy) return;
    if (!(f.title || '').trim()) {
      setStateRaw((s) => ({ ...s, aiCaption: 'Write a rough caption first — then I can refine it.' }));
      return;
    }
    setStateRaw((s) => ({ ...s, refineBusy: true, aiCaption: null }));
    let out;
    try {
      out = await refineCaption(f.platform, f.title);
    } catch {
      out = 'AI is unavailable right now — please try again in a moment.';
    }
    setStateRaw((s) => ({ ...s, refineBusy: false, aiCaption: out }));
  }, []);

  const useAiCaption = useCallback(() => {
    setStateRaw((s) => ({ ...s, aiCaption: null, form: { ...s.form, title: s.aiCaption } }));
  }, []);

  // --- Team ---
  const invite = useCallback(async () => {
    const S = stateRef.current;
    const em = S.inviteEmail.trim();
    if (!em) return;
    if (S.backend) {
      setStateRaw((s) => ({ ...s, inviteEmail: '' }));
      try {
        const member = await repo.inviteMember(em, S.inviteRole);
        setStateRaw((s) => ({ ...s, team: s.team.concat([member]) }));
      } catch (err) {
        fail('Invite failed', err);
      }
    } else {
      const nm = em.split('@')[0];
      const name = nm.charAt(0).toUpperCase() + nm.slice(1);
      const initials = name.slice(0, 2).toUpperCase();
      setStateRaw((s) => ({
        ...s,
        inviteEmail: '',
        team: s.team.concat([{ initials, name, email: em, role: 'Invited — pending', perm: s.inviteRole }]),
      }));
    }
  }, [fail]);

  const removeMember = useCallback(
    (initials) => {
      const S = stateRef.current;
      const member = S.team.find((m) => m.initials === initials);
      setStateRaw((s) => ({ ...s, team: s.team.filter((x) => x.initials !== initials) }));
      if (S.backend && member?.id) repo.removeMember(member.id).catch((err) => fail('Remove failed', err));
    },
    [fail],
  );

  // --- Connections ---
  const toggleConnection = useCallback(
    (key) => {
      const S = stateRef.current;
      const nextVal = !S.connections[key];
      setStateRaw((s) => ({ ...s, connections: { ...s.connections, [key]: nextVal } }));
      if (S.backend) repo.setConnection(key, nextVal).catch((err) => fail('Connection not saved', err));
    },
    [fail],
  );

  // --- Workspace settings / notifications (persisted) ---
  const persistSettings = useCallback(
    (patch) => {
      if (stateRef.current.backend) repo.updateSettings(patch).catch((err) => fail('Settings not saved', err));
    },
    [fail],
  );

  const toggleWsApproval = useCallback(() => {
    setStateRaw((s) => {
      const wsApproval = !s.wsApproval;
      return { ...s, wsApproval, form: { ...s.form, requiresApproval: wsApproval } };
    });
    persistSettings({ wsApproval: !stateRef.current.wsApproval });
  }, [persistSettings]);

  const setWsReminder = useCallback(
    (v) => {
      setStateRaw((s) => ({ ...s, wsReminder: v, form: { ...s.form, reminder: v } }));
      persistSettings({ wsReminder: v });
    },
    [persistSettings],
  );

  const setWsTz = useCallback(
    (v) => {
      setStateRaw((s) => ({ ...s, wsTz: v }));
      persistSettings({ wsTz: v });
    },
    [persistSettings],
  );

  const toggleNotif = useCallback(
    (key) => {
      const nextVal = !stateRef.current.notifs[key];
      setStateRaw((s) => ({ ...s, notifs: { ...s.notifs, [key]: nextVal } }));
      persistSettings({ notifs: { [key]: nextVal } });
    },
    [persistSettings],
  );

  const setNotifChannel = useCallback(
    (v) => {
      setStateRaw((s) => ({ ...s, notifChannel: v }));
      persistSettings({ notifChannel: v });
    },
    [persistSettings],
  );

  const value = useMemo(
    () => ({
      state,
      setState,
      setForm,
      openComposer,
      openNewPost: () => openComposer(TODAY),
      closeModal,
      savePost,
      advancePost,
      addMedia,
      removeMedia,
      sendAi,
      doRefineCaption,
      useAiCaption,
      invite,
      removeMember,
      toggleConnection,
      toggleWsApproval,
      setWsReminder,
      setWsTz,
      toggleNotif,
      setNotifChannel,
      signOut,
      resetForm: () => setForm(initialForm),
      PLATFORMS,
    }),
    [
      state, setState, setForm, openComposer, closeModal, savePost, advancePost,
      addMedia, removeMedia, sendAi, doRefineCaption, useAiCaption, invite,
      removeMember, toggleConnection, toggleWsApproval, setWsReminder, setWsTz,
      toggleNotif, setNotifChannel, signOut,
    ],
  );

  return <HubContext.Provider value={value}>{children}</HubContext.Provider>;
}
