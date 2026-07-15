import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { initialState, initialForm } from './data/seed.js';
import { ORDER, PLATFORMS, TODAY } from './constants.js';
import { validateFiles } from './lib/media.js';
import { assistantComplete, buildAssistantSystem, refineCaption } from './lib/ai.js';

const HubContext = createContext(null);

export function useHub() {
  const ctx = useContext(HubContext);
  if (!ctx) throw new Error('useHub must be used within <HubProvider>');
  return ctx;
}

export function HubProvider({ children }) {
  const [state, setStateRaw] = useState(initialState);

  // Class-style setState: shallow-merge a patch or the result of an updater fn.
  const setState = useCallback((patch) => {
    setStateRaw((prev) => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }));
  }, []);

  // Keep a live ref so async actions read the latest state without stale closures.
  const stateRef = useRef(state);
  stateRef.current = state;

  const setForm = useCallback(
    (patch) => setStateRaw((s) => ({ ...s, form: { ...s.form, ...patch } })),
    [],
  );

  const openComposer = useCallback((iso) => {
    setStateRaw((s) => ({
      ...s,
      modalOpen: true,
      aiCaption: null,
      form: { ...s.form, date: iso, title: '', media: [] },
    }));
  }, []);

  const closeModal = useCallback(() => setStateRaw((s) => ({ ...s, modalOpen: false })), []);

  // --- Composer save (draft / review / scheduled) ---
  const savePost = useCallback((status) => {
    setStateRaw((s) => {
      if (!(s.form.title || '').trim()) return { ...s, modalOpen: false };
      const next = {
        id: Date.now(),
        date: s.form.date,
        time: s.form.time,
        platform: s.form.platform,
        title: s.form.title,
        status,
        assignee: s.form.assignee,
        campaign: s.form.campaign,
      };
      return { ...s, modalOpen: false, posts: s.posts.concat([next]) };
    });
  }, []);

  // --- Kanban advance ---
  const advancePost = useCallback((id) => {
    setStateRaw((s) => ({
      ...s,
      posts: s.posts.map((p) =>
        p.id === id ? { ...p, status: ORDER[ORDER.indexOf(p.status) + 1] } : p,
      ),
    }));
  }, []);

  // --- Media upload (validated) ---
  const addMedia = useCallback((e) => {
    const files = e.target.files;
    if (!files || !files.length) return;
    const items = validateFiles(files, stateRef.current.form.platform);
    e.target.value = '';
    setStateRaw((s) => ({ ...s, form: { ...s.form, media: s.form.media.concat(items) } }));
  }, []);

  const removeMedia = useCallback((id) => {
    setStateRaw((s) => ({ ...s, form: { ...s.form, media: s.form.media.filter((m) => m.id !== id) } }));
  }, []);

  // --- AI assistant chat ---
  const sendAi = useCallback(async (q) => {
    const S = stateRef.current;
    const question = (typeof q === 'string' ? q : S.aiInput).trim();
    if (!question || S.aiBusy) return;
    const history = S.aiMsgs.map((m) => ({ role: m.role, content: m.text }));
    setStateRaw((s) => ({
      ...s,
      aiBusy: true,
      aiInput: '',
      aiMsgs: s.aiMsgs.concat([{ role: 'user', text: question }]),
    }));
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

  // --- AI caption refinement (composer) ---
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
  const invite = useCallback(() => {
    setStateRaw((s) => {
      const em = s.inviteEmail.trim();
      if (!em) return s;
      const nm = em.split('@')[0];
      const name = nm.charAt(0).toUpperCase() + nm.slice(1);
      const initials = name.slice(0, 2).toUpperCase();
      return {
        ...s,
        inviteEmail: '',
        team: s.team.concat([{ initials, name, email: em, role: 'Invited — pending', perm: s.inviteRole }]),
      };
    });
  }, []);

  const removeMember = useCallback((initials) => {
    setStateRaw((s) => ({ ...s, team: s.team.filter((x) => x.initials !== initials) }));
  }, []);

  // --- Connections ---
  const toggleConnection = useCallback((key) => {
    setStateRaw((s) => ({ ...s, connections: { ...s.connections, [key]: !s.connections[key] } }));
  }, []);

  // --- Workspace / notifications ---
  const toggleWsApproval = useCallback(() => {
    setStateRaw((s) => ({ ...s, wsApproval: !s.wsApproval, form: { ...s.form, requiresApproval: !s.wsApproval } }));
  }, []);

  const setWsReminder = useCallback((v) => {
    setStateRaw((s) => ({ ...s, wsReminder: v, form: { ...s.form, reminder: v } }));
  }, []);

  const toggleNotif = useCallback((key) => {
    setStateRaw((s) => ({ ...s, notifs: { ...s.notifs, [key]: !s.notifs[key] } }));
  }, []);

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
      toggleNotif,
      resetForm: () => setForm(initialForm),
      PLATFORMS,
    }),
    [
      state, setState, setForm, openComposer, closeModal, savePost, advancePost,
      addMedia, removeMedia, sendAi, doRefineCaption, useAiCaption, invite,
      removeMember, toggleConnection, toggleWsApproval, setWsReminder, toggleNotif,
    ],
  );

  return <HubContext.Provider value={value}>{children}</HubContext.Provider>;
}
