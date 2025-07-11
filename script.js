const handleRegistration = (event) => {
  event.preventDefault();
  const username = document.getElementById("registration-username").value;
  const first_name = document.getElementById("registration-first-name").value;
  const last_name = document.getElementById("registration-last-name").value;
  const email = document.getElementById("registration-email").value;
  const password = document.getElementById("registration-password").value;
  const confirm_password = document.getElementById(
    "registration-confirm-password"
  ).value;
  const info = {
    username,
    first_name,
    last_name,
    email,
    password,
    confirm_password,
  };

  if (password === confirm_password) {
    document.getElementById("error-messages").innerText = "";
    document.getElementById("success-messages").innerText = "";
    if (/^(?=.*\d)(?=(.*\W){2})(?=.*[a-zA-Z])(?!.*\s).{1,15}$/.test(password)) {
      fetch("https://tuition-lagbe.onrender.com/user/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          document.getElementById("success-messages").innerText =
            "Registration successful! Please check your email to activate your account.";
          alert(
            "Registration successful! Please check your email to activate your account."
          );
          document.getElementById("registration-form").reset();
        })
        .catch((error) => {
          console.error("Error:", error);

          alert(error.message || "An error occurred. Please try again.");
        });
    } else {
      document.getElementById("error-messages").innerText =
        "password must contain at least 1 digit 2 special characters & 1 alphabetic character";
    }
  } else {
    document.getElementById("error-messages").innerText =
      "password and confirm password doesn't match.";
  }
};

const handleLogin = (event) => {
  event.preventDefault();
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;
  const info = { username, password };

  fetch("https://tuition-lagbe.onrender.com/user/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(info),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.token && data.user_id) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user_id);
        const token = localStorage.getItem("token");
        const user_id = localStorage.getItem("user_id");
        console.log(token);
        console.log(user_id);
        alert("Login successful");
        window.location.href = "profile.html";
      } else {
        const errorMessage =
          data.detail || data.Error || "Invalid username or password";
        alert(errorMessage);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Something went wrong. Please try again later.");
    });
};

const handleLogout = () => {
  const token = localStorage.getItem("token");

  fetch("https://tuition-lagbe.onrender.com/user/logout/", {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      alert("Logout Successful");
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(
        error.message || "An error occurred during logout. Please try again."
      );
    });
};

document.addEventListener("DOMContentLoaded", () => {
  const navButtons = document.getElementById("nav-buttons");

  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  if (token && user_id) {
    fetch(`https://tuition-lagbe.onrender.com/user/list/?id=${user_id}`, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        navButtons.innerHTML = `
                    <li>
                        <span id="user-name" class="me-2">
                            Welcome, ${data[0].username}
                        </span>
                        <a class="btn btn-outline-secondary" href="profile.html">Profile</a>
                    </li>
                    <li>
                        <a class="btn btn-outline-dark" onclick="handleLogout()">Logout</a>
                    </li>
                `;
      });
  } else {
    navButtons.innerHTML = `
            <li>
                <a class="btn btn-outline-secondary" href="login.html">Login</a>
            </li>
            <li>
                <a class="btn btn-outline-dark" href="register.html">Sign up</a>
            </li>
        `;
  }
});

const loadTuitions = (search) => {
  console.log(search);
  const parent = document.getElementById("tuitions");
  parent.innerHTML = "";
  const noTuitions = document.getElementById("notuitions");

  fetch(
    `https://tuition-lagbe.onrender.com/tuition/list/?search=${
      search ? search : ""
    }`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.length > 0) {
        noTuitions.style.display = "none";
        displayTuitions(data);
      } else {
        parent.innerHTML = "";
        noTuitions.style.display = "block";
      }
    });
};
const displayTuitions = (tuitions) => {
  const parent = document.getElementById("tuitions");

  tuitions.forEach((tuition) => {
    const div = document.createElement("div");
    div.classList.add("tuition", "col-md-4", "col-sm-6", "col-12", "mb-4");
    div.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h3 class="card-title fw-bold text-info-emphasis">${tuition.title}</h3>
                    <h6 class="card-subtitle mb-2">Subject: ${tuition.subject}</h6>
                    <h6 class="card-subtitle mb-2">Class: ${tuition.class_name}</h6>
                    <p class="card-text">${tuition.description}</p>
                    <a href="tuition_details.html?id=${tuition.id}" class="card-link btn btn-primary fw-bold">Details</a>
                </div>
            </div>
        `;
    parent.appendChild(div);
  });
};

const loadClassName = () => {
  fetch("https://tuition-lagbe.onrender.com/tuition/class/")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const parent = document.getElementById("dropdown-menu");
      data.forEach((data) => {
        parent.innerHTML += `
                    <li><a class="dropdown-item btn text-info-emphasis" onclick="loadTuitions('${data.name}')">
                    ${data.name}</a></li>
                `;
      });
    });
};

const loadTuitionDetails = () => {
  const id = parseInt(new URLSearchParams(window.location.search).get("id"));
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  fetch(`https://tuition-lagbe.onrender.com/tuition/list/?id=${id}`)
    .then((res) => res.json())
    .then((data) => displayTuitionDetails(data[0]));

  fetch(
    `https://tuition-lagbe.onrender.com/application/review/list/?tuition_id=${id}`
  )
    .then((res) => res.json())
    .then((data) => {
      const reviewsList = document.getElementById("reviews-list");
      reviewsList.innerHTML = "";
      const totalReviews = document.getElementById("total-reviews");
      totalReviews.innerText = `Total Reviews: ${data.length}`;
      if (data.length > 0) {
        data.forEach((review) => {
          const div = document.createElement("div");
          div.classList.add("card", "mb-3", "shadow-sm");
          div.innerHTML = `
                        <div class="card-body">
                            <p class="card-text">${review.body}</p>
                            <p>Rating:${review.rating}</p>
                            <p class="">By <strong>${
                              review.user_details.username
                            }</strong> on ${new Date(
            review.created_at
          ).toLocaleString()}</p>
                        </div>
                    `;
          reviewsList.appendChild(div);
        });
      } else {
        reviewsList.innerHTML = '<p class="text-muted">No reviews yet.</p>';
      }
    })
    .catch((error) => console.error("Error loading reviews:", error));

  if (token) {
    fetch(
      `https://tuition-lagbe.onrender.com/application/list/?user_id=${user_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        const accepted = data.some(
          (tuition) => tuition.tuition === id && tuition.status === "accepted"
        );
        // console.log(accepted);
        if (accepted) {
          document.getElementById("add-review-section").style.display = "block";
        } else {
          document.getElementById("add-review-section").style.display = "none";
        }
      });
  } else {
    document.getElementById("add-review-section").style.display = "none";
  }
};
const displayTuitionDetails = (tuition) => {
  // console.log(tuition);
  const parent = document.getElementById("tuition-details");
  parent.innerHTML = "";
  const div = document.createElement("div");
  div.classList.add("card", "shadow-lg");
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  const tuition_id = tuition.id;
  div.innerHTML = `
        <div class="card-body">
            <h2 class="card-title" id="tuition-title">${tuition.title}</h2>
            <p class="card-text text-muted" id="tuition-description">${tuition.description}</p>
            <ul class="list-group list-group-flush mb-2">
                <li class="list-group-item"><strong>Subject:</strong> ${tuition.subject}</li>
                <li class="list-group-item"><strong>Class:</strong> ${tuition.class_name}</li>
                <li class="list-group-item" id="application-status">
                
                </li>
            </ul>
            
        </div>
    `;
  parent.appendChild(div);

  const status = document.getElementById("application-status");
  if (token) {
    fetch(
      `https://tuition-lagbe.onrender.com/application/list/?user_id=${user_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const application = data.find(
          (tuition) => tuition.tuition === tuition_id
        );
        console.log(application);
        if (application) {
          if (application.status === "accepted") {
            status.innerHTML = `<span class="text-success fw-bold">Congratulations! You got the tuition.</span>`;
          } else if (application.status === "rejected") {
            status.innerHTML = `<span class="text-danger fw-bold">Sorry! You are rejected for this tuition.</span>`;
          } else {
            status.innerHTML = `<span class="text-warning fw-bold">Your application is pending.</span>`;
          }
        } else if (!tuition.is_available) {
          status.innerHTML = `<span class="text-danger fw-bold">This tuition is no longer available.</span>`;
          return;
        } else {
          status.innerHTML = `<a href="" class="card-link text-light btn btn-success" onclick="handleApply(event)">Apply</a>`;
        }
      });
  } else {
    status.innerHTML = `<a href="login.html" class="card-link text-decoration-none">Login to Apply</a>`;
  }
};

const handleApply = (event) => {
  event.preventDefault();
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  const tuition_id = new URLSearchParams(window.location.search).get("id");
  const info = { user: user_id, tuition: tuition_id };

  console.log("Payload:", info);

  fetch(`https://tuition-lagbe.onrender.com/application/list/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(info),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      alert("Applied Successfully!");
      loadTuitionDetails();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(
        error.message || "An error occurred while applying. Please try again."
      );
    });
};

const handleReview = (event) => {
  event.preventDefault();
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");

  const body = document.getElementById("review-body").value;
  const rating = document.getElementById("review-rating").value;
  const tuition_id = new URLSearchParams(window.location.search).get("id");
  const info = { user: user_id, tuition: tuition_id, body, rating };
  // console.log(info);
  if (body.trim() === "") {
    alert("Review cannot be empty.");
    return;
  }
  fetch(`https://tuition-lagbe.onrender.com/application/review/list/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(info),
  })
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      alert("Review submitted successfully!");
      document.getElementById("review-form").reset();
      loadTuitionDetails();
    })
    .catch((error) => {
      console.error("Error submitting review:", error);
      alert(
        "An error occurred while submitting your review. Please try again."
      );
    });
};

document.addEventListener("DOMContentLoaded", () => {
  const changePasswordContainer = document.getElementById(
    "change-password-container"
  );

  document.addEventListener("click", (event) => {
    if (event.target && event.target.id === "show-password-form-btn") {
      if (changePasswordContainer.style.display === "none") {
        changePasswordContainer.style.display = "block";
        event.target.textContent = "Hide Change Password Form";
      } else {
        changePasswordContainer.style.display = "none";
        event.target.textContent = "Change Password";
      }
    }
  });
});

const loadUserDetails = () => {
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  fetch(`https://tuition-lagbe.onrender.com/user/list/?id=${user_id}`, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      user = data[0];
      const parent = document.getElementById("profile-info");
      const div = document.createElement("div");
      div.classList.add("card", "pb-3");
      div.innerHTML = `
                <div class="card-body text-center">
                    <h4 class="card-title fw-bold mb-3" id="user-name">Hi, ${user.first_name} ${user.last_name}</h4>
                    <h6 class="fw-bold my-2">Email: ${user.email}</h6>
                    <button id="show-password-form-btn" class="btn btn-primary mt-2 change-password-btn">Change
                    Password</button>
                </div>
            `;
      parent.appendChild(div);
    });
};

const handleChangePassword = (event) => {
  event.preventDefault();
  const old_password = document.getElementById("old-password").value;
  const new_password = document.getElementById("new-password").value;
  const confirm_password = document.getElementById(
    "confirm-new-password"
  ).value;
  const token = localStorage.getItem("token");

  const info = { old_password, new_password, confirm_password };

  if (new_password === confirm_password) {
    document.getElementById("change-pass-error-messages").innerText = "";
    document.getElementById("change-pass-success-messages").innerText = "";

    if (
      /^(?=.*\d)(?=(.*\W){2})(?=.*[a-zA-Z])(?!.*\s).{1,15}$/.test(new_password)
    ) {
      fetch("https://tuition-lagbe.onrender.com/user/change_password/", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then((err) => {
              throw new Error(
                err.Error || err.detail || "Failed to change password"
              );
            });
          }
          return res.json();
        })
        .then((data) => {
          console.log(`Token: ${token}`);
          console.log(data);
          document.getElementById("change-pass-success-messages").innerText =
            "Password changed successfully!";
          alert("Password changed successfully!");
          document.getElementById("change-password-form").reset();
        })
        .catch((error) => {
          console.log(error.message);
          alert(error.message || "An error occurred. Please try again.");
          document.getElementById("change-pass-error-messages").innerText =
            error.message || "An error occurred. Please try again.";
        });
    } else {
      document.getElementById("change-pass-error-messages").innerText =
        "password must contain at least 1 digit 2 special characters & 1 alphabetic character";
    }
  } else {
    document.getElementById("change-pass-error-messages").innerText =
      "new password and confirm new password doesn't match.";
  }
};

const loadAppliedTuitions = () => {
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  fetch(
    `https://tuition-lagbe.onrender.com/application/list/?user_id=${user_id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const parent = document.getElementById("table-body");
      data.forEach((tuition, index) => {
        const tr = document.createElement("tr");

        let status = "";
        if (tuition.status === "accepted") {
          status = "text-success";
        } else if (tuition.status === "rejected") {
          status = "text-danger";
        } else {
          status = "text-warning";
        }

        tr.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td>${tuition.tuition_details.title}</td>
                <td class="${status}">${tuition.status}</td>
                <td>${new Date(tuition.applied_on).toLocaleString()}</td>
                `;
        parent.appendChild(tr);
      });
    });
};

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("index.html")) {
    loadTuitions();
    loadClassName();
  }

  if (window.location.pathname.includes("profile.html")) {
    loadUserDetails();
    loadAppliedTuitions();
  }

  loadTuitionDetails();
});
// loadTuitions()
// loadTuitionDetails()
// loadClassName()
// loadUserDetails()
// loadAppliedTuitions()
