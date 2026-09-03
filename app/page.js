"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [cases, setCases] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  async function loadCases() {
    const res = await fetch("/api/cases");
    const data = await res.json();

    if (data.success) {
      setCases(data.cases);
    }
  }

  useEffect(() => {
    loadCases();
  }, []);

  const categories = [
    "All",
    ...new Set(cases.map((item) => item.category))
  ];

  const filtered = cases.filter((item) => {
    const searchMatch =
      item.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.description
        .toLowerCase()
        .includes(search.toLowerCase());

    const categoryMatch =
      category === "All" ||
      item.category === category;

    return searchMatch && categoryMatch;
  });

  async function copyCase(code) {
    await navigator.clipboard.writeText(code);
    alert("Case copied!");
  }

  return (
    <main>

      <nav className="navbar">
        <div className="logo">
          BESTIE<span>-MINI-FREE</span>
        </div>

        <a href="/admin">
          ADMIN
        </a>
      </nav>

      <section className="hero">

        <div className="badge">
          CASE HUB
        </div>

        <h1>
          BESTIE-MINI-FREE
          <br />
          <span>CASE COLLECTION</span>
        </h1>

        <p>
          WhatsApp Bot Case Collection
        </p>

        <div className="stats">
          <div>
            <b>{cases.length}</b>
            <small>CASES</small>
          </div>

          <div>
            <b>{categories.length - 1}</b>
            <small>CATEGORIES</small>
          </div>
        </div>

      </section>

      <section className="controls">

        <input
          type="text"
          placeholder="Search cases..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <div className="categories">

          {categories.map((item) => (
            <button
              key={item}
              className={
                category === item
                  ? "active"
                  : ""
              }
              onClick={() =>
                setCategory(item)
              }
            >
              {item}
            </button>
          ))}

        </div>

      </section>

      <section className="caseList">

        {filtered.map((item) => (

          <div
            className="caseCard"
            key={item._id}
          >

            <div className="caseHeader">

              <div>
                <h2>{item.name}</h2>

                <span>
                  {item.category}
                </span>
              </div>

              <button
                onClick={() =>
                  copyCase(item.code)
                }
              >
                COPY
              </button>

            </div>

            <p>
              {item.description}
            </p>

            <pre>
              <code>
                {item.code}
              </code>
            </pre>

          </div>

        ))}

      </section>

      <footer>
        BESTIE-MINI-FREE CASE © 2026
      </footer>

    </main>
  );
      }
