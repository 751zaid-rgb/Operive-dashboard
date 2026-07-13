import React from 'react';
import {
  AbsoluteFill,
  Composition,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export type WeekShortProps = {
  week: string;
  brand: {
    name: string;
    tagline: string;
    primary: string;
    secondary: string;
    bg: string;
    surface: string;
    text: string;
    muted: string;
  };
  headline: string;
  subhead: string;
  body: string;
  steps: string[];
  cta: string;
  url: string;
};

const defaultProps: WeekShortProps = {
  week: '2026-07-13',
  brand: {
    name: 'Operive',
    tagline: 'PRACTICAL AI WORKFLOWS',
    primary: '#335CFF',
    secondary: '#6B3FFF',
    bg: '#070A10',
    surface: '#101522',
    text: '#F0F4FF',
    muted: '#9AA6B8',
  },
  headline: 'Stop losing leads after hours',
  subhead: 'AI Front Desk for WhatsApp & Telegram',
  body: 'Capture the request, answer the repeat questions, and hand off the qualified lead.',
  steps: [
    'Customer messages after hours',
    'Operive answers common questions',
    'Lead details are captured',
    'Human handoff when it matters',
  ],
  cta: 'Book a walkthrough',
  url: 'calendly.com/operive/30min',
};

const Logo: React.FC<{brand: WeekShortProps['brand']}> = ({brand}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
    <div
      style={{
        width: 62,
        height: 62,
        borderRadius: 18,
        background: `linear-gradient(135deg, ${brand.primary}, ${brand.secondary})`,
        display: 'grid',
        placeItems: 'center',
        boxShadow: `0 0 46px ${brand.primary}66`,
        flexShrink: 0,
      }}
    >
      <div style={{position: 'relative', width: 38, height: 38}}>
        <div style={{position: 'absolute', inset: 6, border: '7px solid white', borderRight: 'none', borderRadius: 22}} />
        <div style={{position: 'absolute', right: 3, top: 3, width: 11, height: 11, borderRadius: 999, background: 'white'}} />
        <div style={{position: 'absolute', right: 10, bottom: 5, width: 30, height: 6, borderRadius: 999, background: 'white', transform: 'rotate(-45deg)'}} />
      </div>
    </div>
    <div>
      <div style={{fontFamily: 'Inter, Arial, sans-serif', fontSize: 42, fontWeight: 900, letterSpacing: -1.6}}>
        {brand.name}
      </div>
      <div style={{fontFamily: 'Inter, Arial, sans-serif', color: brand.muted, fontSize: 14, fontWeight: 800, letterSpacing: 2.5}}>
        {brand.tagline}
      </div>
    </div>
  </div>
);

const StepCard: React.FC<{text: string; index: number; brand: WeekShortProps['brand']}> = ({text, index, brand}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entrance = spring({frame: frame - 70 - index * 25, fps, config: {damping: 17, stiffness: 120}});
  return (
    <div
      style={{
        opacity: entrance,
        transform: `translateY(${interpolate(entrance, [0, 1], [38, 0])}px)`,
        background: 'rgba(255,255,255,0.065)',
        border: '1px solid rgba(255,255,255,0.13)',
        borderRadius: 24,
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        boxShadow: '0 20px 70px rgba(0,0,0,0.32)',
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 999,
          display: 'grid',
          placeItems: 'center',
          background: `linear-gradient(135deg, ${brand.primary}, ${brand.secondary})`,
          color: 'white',
          fontSize: 24,
          fontWeight: 900,
          flexShrink: 0,
        }}
      >
        {index + 1}
      </div>
      <div style={{fontSize: 29, fontWeight: 800, lineHeight: 1.13}}>{text}</div>
    </div>
  );
};

const OperiveWeekShort: React.FC<WeekShortProps> = (props) => {
  const data = {...defaultProps, ...props, brand: {...defaultProps.brand, ...(props.brand || {})}};
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const hero = spring({frame, fps, config: {damping: 18, stiffness: 90}});
  const glowX = interpolate(frame, [0, 300], [-160, 160], {extrapolateRight: 'clamp'});
  const cta = spring({frame: frame - 240, fps, config: {damping: 18, stiffness: 110}});

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at ${50 + glowX / 8}% 16%, ${data.brand.primary}55, transparent 34%), linear-gradient(180deg, ${data.brand.bg}, #0B1020 55%, #05070C)`,
        color: data.brand.text,
        fontFamily: 'DM Sans, Inter, Arial, sans-serif',
        padding: 64,
        overflow: 'hidden',
      }}
    >
      <div style={{position: 'absolute', width: 560, height: 560, borderRadius: 999, right: -240, top: 80, background: `linear-gradient(135deg, ${data.brand.primary}38, ${data.brand.secondary}18)`, filter: 'blur(14px)'}} />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 68%, rgba(0,0,0,0.42) 100%)'}} />
      <div style={{position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column'}}>
        <Logo brand={data.brand} />
        <div style={{height: 86}} />
        <div style={{opacity: hero, transform: `translateY(${interpolate(hero, [0, 1], [48, 0])}px)`}}>
          <div style={{display: 'inline-flex', border: `1px solid ${data.brand.primary}66`, color: '#BFD0FF', background: `${data.brand.primary}1A`, borderRadius: 999, padding: '12px 18px', fontSize: 22, fontWeight: 850, letterSpacing: 0.2, maxWidth: 900}}>
            {data.subhead}
          </div>
          <h1 style={{margin: '34px 0 24px', fontSize: data.headline.length > 42 ? 72 : 80, lineHeight: 0.96, letterSpacing: -3.8, fontWeight: 950, maxWidth: 930}}>
            {data.headline}
          </h1>
          <p style={{margin: 0, color: data.brand.muted, fontSize: 30, lineHeight: 1.24, maxWidth: 900, fontWeight: 650}}>
            {data.body}
          </p>
        </div>
        <div style={{height: 52}} />
        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          {data.steps.slice(0, 4).map((step, index) => <StepCard key={step} text={step} index={index} brand={data.brand} />)}
        </div>
        <div style={{flex: 1}} />
        <div
          style={{
            opacity: cta,
            transform: `translateY(${interpolate(cta, [0, 1], [28, 0])}px)`,
            background: `linear-gradient(135deg, ${data.brand.primary}, ${data.brand.secondary})`,
            borderRadius: 28,
            padding: '28px 30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            boxShadow: `0 0 70px ${data.brand.primary}55`,
          }}
        >
          <div style={{fontSize: 34, fontWeight: 950, whiteSpace: 'nowrap'}}>{data.cta}</div>
          <div style={{fontSize: 22, fontWeight: 850, opacity: 0.94, textAlign: 'right'}}>{data.url}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => (
  <Composition
    id="OperiveWeekShort"
    component={OperiveWeekShort}
    durationInFrames={300}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
  />
);
