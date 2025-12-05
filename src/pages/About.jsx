import SectionHeader from "../components/SectionHeader";

export default function About() {
  return (
    <div className="space-y-12">
      <SectionHeader
        title="About EduQuest"
        subtitle="Empowering learners worldwide with cutting-edge courses, expert mentorship, and a community dedicated to lifelong growth."
      />

      {/* Story */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">
          Our story
        </h3>
        <div className="space-y-3 text-sm text-slate-600">
          <p>
            EduQuest began with a simple yet powerful idea: that quality education 
            should be accessible to everyone, regardless of their background or location. 
            We recognized a growing gap between traditional academic learning and the 
            practical skills demanded by the modern industry.
          </p>
          <p>
            What started as a small initiative has grown into a comprehensive learning 
            hub. We brought together passionate educators, industry experts, and 
            technology enthusiasts to build a platform where curiosity meets opportunity.
          </p>
          <p>
            Today, EduQuest stands as a bridge to your future. Whether you are looking 
            to upskill for a promotion, pivot to a new career, or simply explore a 
            new passion, we provide the structured path and resources to help you thrive.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Our mission
          </h3>
          <p className="text-sm text-slate-600">
            To democratize education by providing high-quality, affordable, and 
            industry-relevant resources that bridge the gap between theoretical 
            knowledge and real-world application.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Our vision
          </h3>
          <p className="text-sm text-slate-600">
            To become the world's leading destination for online learning, fostering 
            a global community of innovators, thinkers, and leaders who are equipped 
            to shape the future.
          </p>
        </div>
      </section>

      {/* Values */}
      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          What EduQuest focuses on
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Excellence",
              text: "We partner with top-tier instructors and industry leaders to ensure every course delivers up-to-date, accurate, and practical knowledge.",
            },
            {
              title: "Accessibility",
              text: "We believe barriers shouldn't stop brilliance. Our platform is designed to be user-friendly, affordable, and available on any device, anytime.",
            },
            {
              title: "Community",
              text: "Learning is better together. We foster a supportive environment where students and mentors collaborate, share insights, and grow together.",
            },
          ].map((v) => (
            <div
              key={v.title}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
            >
              <h4 className="font-semibold text-slate-900 mb-1">
                {v.title}
              </h4>
              <p className="text-sm text-slate-600">{v.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}