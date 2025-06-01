import React, { useState, useEffect, useRef } from "react";
import { LeftBar } from "../components/LeftBar";
import { RightBar } from "../components/RightBar";
import { useDebounce } from "../hooks/useDebounce";

// Hàm dịch một đoạn văn (định nghĩa hoặc ví dụ) từ Tiếng Anh sang Tiếng Việt
async function fetchTranslation(text) {
  try {
    const resp = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=en|vi`
    );
    const json = await resp.json();
    if (json.responseData && json.responseData.translatedText) {
      return json.responseData.translatedText;
    }
  } catch (e) {
    console.error("Lỗi khi gọi MyMemory:", e);
  }
  return "";
}

function Vocabulary() {
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Debounce: chỉ gọi API gợi ý khi user ngừng gõ 300ms
  const debouncedKeyword = useDebounce(keyword, 300);
  const wrapperRef = useRef(null);

  // Gọi Datamuse API để lấy suggestions
  useEffect(() => {
    const term = debouncedKeyword.trim();
    if (term.length === 0) {
      setSuggestions([]);
      return;
    }
    fetch(`https://api.datamuse.com/sug?s=${encodeURIComponent(term)}&max=5`)
      .then((res) => res.json())
      .then((data) => {
        setSuggestions(data);
        setShowSuggestions(true);
      })
      .catch((err) => {
        console.error("Datamuse error:", err);
        setSuggestions([]);
      });
  }, [debouncedKeyword]);

  // Ẩn dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectSuggestion = (word) => {
    setKeyword(word);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSearch = async () => {
    const trimmed = keyword.trim();
    if (!trimmed) {
      setError("Error");
      setResults(null);
      return;
    }
    setError("");
    setLoading(true);
    setResults(null);

    try {
      // 1) Gọi Free Dictionary API để lấy définition gốc
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
          trimmed
        )}`
      );
      if (res.status !== 200) {
        if (res.status === 404) {
          setError(`Không tìm thấy định nghĩa cho "${trimmed}".`);
        } else {
          setError(`Lỗi khi gọi API: HTTP ${res.status}`);
        }
        setLoading(false);
        return;
      }
      const data = await res.json();

      // 2) Duyệt qua từng entry để thêm:
      //    - wordVi (dịch chính từ)
      //    - definitionVi (dịch từng definition)
      //    - exampleVi (dịch từng example nếu có)
      const dataProcessed = await Promise.all(
        data.map(async (entry) => {
          // Dịch chính từ
          const wordVi = await fetchTranslation(entry.word);

          // Dịch từng definition & example
          const meaningsWithVi = await Promise.all(
            entry.meanings.map(async (meaning) => {
              const defsWithVi = await Promise.all(
                meaning.definitions.map(async (def) => {
                  // Dịch definition
                  const definitionVi = await fetchTranslation(def.definition);

                  // Nếu có ví dụ, dịch ví dụ luôn
                  let exampleVi = "";
                  if (def.example) {
                    exampleVi = await fetchTranslation(def.example);
                  }

                  return {
                    ...def,
                    definitionVi,
                    exampleVi,
                  };
                })
              );
              return {
                ...meaning,
                definitions: defsWithVi,
              };
            })
          );

          return {
            ...entry,
            wordVi,
            meanings: meaningsWithVi,
          };
        })
      );

      setResults(dataProcessed);
    } catch (err) {
      console.error(err);
      setError("Xảy ra lỗi mạng khi gọi API. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
      setShowSuggestions(false);
    }
  };

  return (
    <>
      <LeftBar selectedTab="Vocabulary" />

      <div className="flex justify-center gap-3 pt-14 sm:p-6 sm:pt-10 md:ml-24 lg:ml-64 lg:gap-12">
        <div className="px-4 pb-20 w-full max-w-3xl" ref={wrapperRef}>
          <div className="py-7">
            <h2 className="mb-5 text-2xl font-bold">Research Vocabulary</h2>

            {/* Input + Dropdown gợi ý */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search..."
                  value={keyword}
                  onChange={(e) => {
                    setKeyword(e.target.value);
                    setError("");
                  }}
                  onKeyPress={handleKeyPress}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 placeholder-gray-400 shadow-sm
                             focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full rounded-b-lg bg-white shadow-lg max-h-60 overflow-auto border border-gray-200">
                    {suggestions.map((sug, i) => (
                      <li
                        key={i}
                        onClick={() => handleSelectSuggestion(sug.word)}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      >
                        {sug.word}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                onClick={() => {
                  handleSearch();
                  setShowSuggestions(false);
                }}
                className="h-12 w-full rounded-lg bg-blue-500 px-6 font-medium text-white shadow-sm hover:bg-blue-600 transition sm:w-auto"
              >
                {loading ? "Đang tìm..." : "Tìm"}
              </button>
            </div>

            {error && <p className="mb-6 text-red-500">{error}</p>}
          </div>

          {/* Kết quả tìm kiếm */}
          {results && (
            <div className="space-y-8">
              {results.map((entry, idx) => (
                <div
                  key={idx}
                  className="w-full rounded-lg bg-white p-6 shadow-md transition hover:shadow-lg"
                >
                  {/* Word + Dịch Word */}
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-800">
                        {entry.word}{" "}
                        {entry.wordVi && (
                          <span className="ml-2 text-lg font-normal text-gray-600">
                            – {entry.wordVi}
                          </span>
                        )}
                      </h3>
                    </div>
                    {entry.phonetics && entry.phonetics[0]?.audio && (
                      <audio controls className="h-10 w-40">
                        <source
                          src={entry.phonetics[0].audio}
                          type="audio/mpeg"
                        />
                        Trình duyệt không hỗ trợ audio.
                      </audio>
                    )}
                  </div>

                  {/* Phonetics (phiên âm) */}
                  {entry.phonetics && entry.phonetics[0]?.text && (
                    <p className="mb-4 font-medium text-gray-600">
                      Phonetics:{" "}
                      <span className="italic">{entry.phonetics[0].text}</span>
                    </p>
                  )}

                  {/* Meanings + Definitions + Dịch nghĩa + Ví dụ + Dịch ví dụ */}
                  {entry.meanings.map((meaning, mIdx) => (
                    <div key={mIdx} className="mb-6">
                      <p className="mb-2 text-lg font-medium text-blue-600">
                        ({meaning.partOfSpeech})
                      </p>
                      <ul className="list-inside list-decimal space-y-3 pl-4">
                        {meaning.definitions.map((def, dIdx) => (
                          <li key={dIdx} className="space-y-1">
                            {/* Definition gốc (Tiếng Anh) */}
                            <p className="text-gray-700">{def.definition}</p>
                            {/* Dịch nghĩa (Tiếng Việt) */}
                            {def.definitionVi && (
                              <p className="ml-4 text-gray-500 italic">
                                {def.definitionVi}
                              </p>
                            )}
                            {/* Ví dụ gốc (nếu có) */}
                            {def.example && (
                              <p className="ml-4 text-gray-500 italic">
                                Ví dụ: {def.example}
                              </p>
                            )}
                            {/* Dịch ví dụ (nếu có) */}
                            {def.example && def.exampleVi && (
                              <p className="ml-6 text-gray-400 italic">
                                {def.exampleVi}
                              </p>
                            )}
                            {/* Synonyms / Antonyms */}
                            {def.synonyms && def.synonyms.length > 0 && (
                              <p className="ml-4 text-green-600">
                                Synonyms: {def.synonyms.join(", ")}
                              </p>
                            )}
                            {def.antonyms && def.antonyms.length > 0 && (
                              <p className="ml-4 text-red-600">
                                Antonyms: {def.antonyms.join(", ")}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <RightBar />
      </div>
    </>
  );
}

export default Vocabulary;
