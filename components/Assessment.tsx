"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Quiz from "./Quiz";
import Results from "./Results";
import { decodeResultId, encodeResultId, OTHER_INDEX, type Answers } from "@/lib/assessment";

export default function Assessment() {
  const router = useRouter();
  const params = useSearchParams();
  const [answers, setAnswers] = useState<Answers>({ single: {}, barriers: [], otherText: "" });

  const id = params.get("id") ?? "";
  const result = params.has("result") ? decodeResultId(id, params.get("other") ?? "") : null;

  const finish = () => {
    let url = `/?result&id=${encodeResultId(answers)}`;
    const other = answers.otherText.trim();
    if (answers.barriers[0] === OTHER_INDEX && other) url += `&other=${encodeURIComponent(other)}`;
    router.push(url);
  };

  return result ? (
    <Results answers={result} resultId={id.toLowerCase()} />
  ) : (
    <Quiz answers={answers} onChange={setAnswers} onSubmit={finish} />
  );
}
