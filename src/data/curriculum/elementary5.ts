import type { CurriculumGrade } from "@/types/problem";

export const elementary5Curriculum: CurriculumGrade = {
  grade: "초등 5학년",
  units: [
    {
      name: "분수",
      concepts: [
        { name: "약분" },
        { name: "통분" },
        { name: "분수의 덧셈" },
        { name: "분수의 뺄셈" },
      ],
    },
  ],
};

export const curriculum = [elementary5Curriculum];
