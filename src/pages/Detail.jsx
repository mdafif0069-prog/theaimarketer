import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Play, Plus, Check, Star, ArrowLeft, Share2, Clock } from 'lucide-react';
import { api } from '../api/client.js';
import { useApp } from '../context/AppProviders.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { useToast } from '../context/ToastContext.jsx';
import { Skeleton } from '../components/Skeleton.jsx';
import { ContentRow } from '../components/ContentRow.jsx';
import { SuitabilityPanel } from '../components/SuitabilityPanel.jsx';
import { TierBadge, ReviewBadge } from '../components/NoorRatingBadge.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { gradientStyle, formatDuration } from '../lib/utils.js';

export default function Detail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { activeProfile, activeProfileId, isInWatchlist, toggleWatchlist } = useApp();
  const { toast } = useToast();

  const { loading, data, error } = useAsync(
    () => api.getTitle(slug, activeProfile),
    [slug, activeProfileId],
  );

  if (loading) {
    return (
      <div className="pt-16">
        <Skeleton className="h-[56vh] w-full rounded-none" />
        <div className="mx-auto max-w-5xl px-4 py-8">
          <Skeleton className="mb-4 h-8 w-2/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24">
        <EmptyState
          title="Not available in Kids Mode"
          message={error.message}
          action={<Link to="/" className="btn-primary">Back to Home</Link>}
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="pt-24">
        <EmptyState
          title="Title not found"
          message="This title may have been removed."
          action={<Link to="/browse" className="btn-primary">Browse catalog</Link>}
        />
      </div>
    );
  }

  const inList = activeProfileId ? isInWatchlist(activeProfileId, data.id) : false;
  const onToggle = () => {
    toggleWatchlist(activeProfileId, data.id);
    toast(inList ? 'Removed from My List' : 'Added to My List');
  };

  return (
    <div className="pb-16">
      {/* Cinematic backdrop */}
      <div className="relative h-[56vh] min-h-[420px] w-full overflow-hidden">
        <div className="absolute inset-0" style={gradientStyle(data.grad, 120)} />
        <div className="absolute inset-0 bg-gradient-to-t from-noor-bg via-noor-bg/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-noor-bg/80 to-transparent" />

        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-20 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-sm backdrop-blur hover:bg-black/60 sm:left-6 lg:left-10"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1600px] px-4 pb-8 sm:px-6 lg:px-10">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <TierBadge tier={data.tier} />
            <ReviewBadge status={data.suitability.reviewStatus} />
          </div>
          <h1 className="max-w-3xl font-display text-4xl font-extrabold leading-tight drop-shadow-lg sm:text-5xl">
            {data.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-noor-text/80">
            <span className="flex items-center gap-1 font-semibold text-noor-gold">
              <Star className="h-4 w-4 fill-noor-gold" /> {data.rating}
            </span>
            <span>{data.year}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {data.durationSec ? formatDuration(data.durationSec) : `${data.episodes?.length || 0} episodes`}
            </span>
            <span className="text-noor-muted">{data.speaker}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto grid max-w-[1600px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-3 lg:px-10">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => navigate(`/watch/${data.slug}`)} className="btn-primary text-base">
              <Play className="h-5 w-5 fill-noor-bg" /> Play
            </button>
            <button onClick={onToggle} className="btn-ghost">
              {inList ? <Check className="h-5 w-5 text-noor-emerald" /> : <Plus className="h-5 w-5" />}
              {inList ? 'In My List' : 'My List'}
            </button>
            <button
              onClick={() => toast('Link copied (demo)')}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 hover:bg-white/10"
              aria-label="Share"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-noor-text/90">{data.synopsis}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {data.topics?.map((tp) => (
              <span key={tp} className="chip capitalize">{tp}</span>
            ))}
          </div>

          {/* Episodes */}
          {data.episodes && (
            <div className="mt-10">
              <h2 className="mb-4 font-display text-xl font-bold">Episodes</h2>
              <div className="space-y-3">
                {data.episodes.map((ep) => (
                  <button
                    key={ep.id}
                    onClick={() => navigate(`/watch/${data.slug}`)}
                    className="flex w-full items-center gap-4 rounded-xl border border-white/5 bg-noor-surface p-3 text-left transition-colors hover:bg-noor-surface2"
                  >
                    <span
                      className="flex h-16 w-28 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-noor-bg"
                      style={gradientStyle(data.grad)}
                    >
                      <Play className="h-6 w-6 fill-noor-bg/80" />
                    </span>
                    <span className="flex-1">
                      <span className="block font-semibold">
                        {ep.number}. {ep.name}
                      </span>
                      <span className="mt-0.5 block text-sm text-noor-muted line-clamp-1">
                        {ep.synopsis}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm text-noor-muted">
                      {formatDuration(ep.durationSec)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <SuitabilityPanel suitability={data.suitability} />

          <div className="card-surface mt-6 p-5">
            <h3 className="mb-3 font-display font-semibold">Details</h3>
            <dl className="space-y-2 text-sm">
              <Detail2 label="Speaker / Studio" value={data.speaker} />
              <Detail2 label="Year" value={data.year} />
              <Detail2 label="Audio" value={data.languagesAvailable?.join(', ')} />
              <Detail2 label="Subtitles" value={data.subtitleLanguages?.join(', ')} />
            </dl>
          </div>
        </div>
      </div>

      {/* Related */}
      {data.related?.length > 0 && (
        <div className="mt-6">
          <ContentRow title="More like this" items={data.related} />
        </div>
      )}
    </div>
  );
}

function Detail2({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-noor-muted">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
