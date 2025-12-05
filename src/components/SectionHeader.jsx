export default function SectionHeader({ title, subtitle }) {
  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-slate-900 mb-2">{title}</h2>
      {subtitle && (
        <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}
