"use client";

import { useEffect, useState } from "react";

export default function Admin() {

  const [login, setLogin] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [cases, setCases] = useState([]);

  const [name, setName] = useState("");
  const [category, setCategory] =
    useState("General");
  const [description, setDescription] =
    useState("");
  const [code, setCode] = useState("");

  const [editId, setEditId] =
    useState(null);

  async function loadCases() {

    const res =
      await fetch("/api/cases");

    const data =
      await res.json();

    if (data.success) {
      setCases(data.cases);
    }
  }

  useEffect(() => {

    if (
      localStorage.getItem(
        "bestie_admin"
      ) === "true"
    ) {
      setLogin(true);
      loadCases();
    }

  }, []);

  async function doLogin() {

    const res = await fetch(
      "/api/auth",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      }
    );

    const data = await res.json();

    if (data.success) {

      localStorage.setItem(
        "bestie_admin",
        "true"
      );

      setLogin(true);
      loadCases();

    } else {

      alert("Wrong username or password");

    }
  }

  async function saveCase() {

    if (!name || !code) {
      alert("Enter case name and code");
      return;
    }

    const res = await fetch(
      "/api/cases",
      {
        method: editId
          ? "PUT"
          : "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          id: editId,
          name,
          category,
          description,
          code
        })
      }
    );

    const data = await res.json();

    if (data.success) {

      alert(
        editId
          ? "Case updated!"
          : "Case added!"
      );

      clearForm();
      loadCases();
    }
  }

  function clearForm() {

    setEditId(null);
    setName("");
    setCategory("General");
    setDescription("");
    setCode("");

  }

  function editCase(item) {

    setEditId(item._id);
    setName(item.name);
    setCategory(item.category);
    setDescription(item.description);
    setCode(item.code);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  async function deleteCase(id) {

    if (!confirm("Delete this case?"))
      return;

    await fetch(
      "/api/cases",
      {
        method: "DELETE",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          id
        })
      }
    );

    loadCases();
  }

  function logout() {

    localStorage.removeItem(
      "bestie_admin"
    );

    setLogin(false);
  }

  if (!login) {

    return (

      <main className="loginPage">

        <div className="loginBox">

          <h1>
            BESTIE-MINI-FREE
          </h1>

          <h2>
            ADMIN PANEL
          </h2>

          <input
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button onClick={doLogin}>
            LOGIN
          </button>

          <a href="/">
            ← Back
          </a>

        </div>

      </main>

    );
  }

  return (

    <main className="adminPage">

      <header className="adminHeader">

        <div>
          <h1>
            BESTIE-MINI-FREE
          </h1>

          <p>
            CASE ADMIN PANEL
          </p>
        </div>

        <div>

          <a href="/">
            WEBSITE
          </a>

          <button onClick={logout}>
            LOGOUT
          </button>

        </div>

      </header>

      <section className="adminContainer">

        <div className="formBox">

          <h2>
            {editId
              ? "EDIT CASE"
              : "ADD NEW CASE"}
          </h2>

          <input
            placeholder="Case name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            placeholder="Category"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
          />

          <textarea
            className="codeInput"
            placeholder="Paste case code..."
            value={code}
            onChange={(e) =>
              setCode(e.target.value)
            }
          />

          <button
            className="saveBtn"
            onClick={saveCase}
          >
            {editId
              ? "UPDATE CASE"
              : "ADD CASE"}
          </button>

          {editId && (

            <button
              className="cancelBtn"
              onClick={clearForm}
            >
              CANCEL
            </button>

          )}

        </div>

        <div className="listBox">

          <h2>
            ALL CASES
          </h2>

          {cases.map((item) => (

            <div
              className="adminCase"
              key={item._id}
            >

              <div>

                <h3>
                  {item.name}
                </h3>

                <small>
                  {item.category}
                </small>

              </div>

              <div>

                <button
                  onClick={() =>
                    editCase(item)
                  }
                >
                  EDIT
                </button>

                <button
                  className="delete"
                  onClick={() =>
                    deleteCase(item._id)
                  }
                >
                  DELETE
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>

    </main>

  );
      }
