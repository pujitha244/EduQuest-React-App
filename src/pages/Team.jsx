import { useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import api from "../api/api";

export default function Team() {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    api
      .get("/team")
      .then((res) => setTeam(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-10">
      <SectionHeader
        title="Meet the EduQuest team"
        subtitle="Educators, mentors, and content designers focused on making learning more practical and enjoyable."
      />

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member) => (
          <div
            key={member.id}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex flex-col gap-2"
          >
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-700">
              {member.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                {member.name}
              </h3>
              <p className="text-xs text-indigo-600 mb-1">
                {member.role}
              </p>
              <p className="text-sm text-slate-600">{member.bio}</p>
            </div>
          </div>
        ))}

        {team.length === 0 && (
          <p className="text-sm text-slate-500">
            Team profiles will load from JSON Server when available.
          </p>
        )}
      </section>
    </div>
  );
}
