// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9A16lBhPsu4T8Re3LRAmsKrkkVa0-6j0",
  authDomain: "portfolio-6f9d2.firebaseapp.com",
  projectId: "portfolio-6f9d2",
  storageBucket: "portfolio-6f9d2.firebasestorage.app",
  messagingSenderId: "31934810765",
  appId: "1:31934810765:web:172d13faf385fb0e31f0c4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Form handling
const contactform = document.querySelector(".cform");
const fname = document.querySelector(".name");
const em = document.querySelector(".email");
const phn = document.querySelector(".phone");
const msg = document.querySelector(".tarea");
const submit = document.querySelector(".sub");

submit.addEventListener("click", (e) => {
  e.preventDefault();
  addDoc(collection(db, "contactform"), {
    fullname: fname.value,
    email: em.value,
    phonenumber: phn.value,
    message: msg.value,
  })
    .then(() => {
      contactform.reset();
      alert("Message sent successfully!");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
});

const fetchDataButton = document.querySelector(".fetch-data");
const dataTableBody = document.querySelector("#data-table tbody");

fetchDataButton.addEventListener("click", async () => {
  dataTableBody.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";
  try {
    const querySnapshot = await getDocs(collection(db, "contactform"));
    dataTableBody.innerHTML = "";
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const docId = docSnap.id;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.fullname}</td>
        <td>${data.email}</td>
        <td>${data.phonenumber}</td>
        <td>${data.message}</td>
        <td>
          <button class="update-btn" data-id="${docId}">Update</button>
          <button class="delete-btn" data-id="${docId}">Delete</button>
        </td>
      `;
      dataTableBody.appendChild(row);
    });

    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", async (e) => {
        const docId = e.target.dataset.id;
        try {
          await deleteDoc(doc(db, "contactform", docId));
          alert("Document deleted successfully!");
          e.target.closest("tr").remove();
        } catch (error) {
          console.error("Error deleting document: ", error);
        }
      });
    });

    document.querySelectorAll(".update-btn").forEach((button) => {
      button.addEventListener("click", async (e) => {
        const docId = e.target.dataset.id;
        const row = e.target.closest("tr");
        const fullname = prompt("Update Name:", row.children[0].textContent);
        const email = prompt("Update Email:", row.children[1].textContent);
        const phonenumber = prompt(
          "Update Phone:",
          row.children[2].textContent
        );
        const message = prompt("Update Message:", row.children[3].textContent);

        if (fullname && email && phonenumber && message) {
          try {
            await updateDoc(doc(db, "contactform", docId), {
              fullname,
              email,
              phonenumber,
              message,
            });
            alert("Document updated successfully!");

            row.children[0].textContent = fullname;
            row.children[1].textContent = email;
            row.children[2].textContent = phonenumber;
            row.children[3].textContent = message;
          } catch (error) {
            console.error("Error updating document: ", error);
          }
        } else {
          alert("Update canceled or invalid input.");
        }
      });
    });
  } catch (error) {
    console.error("Error fetching documents: ", error);
    dataTableBody.innerHTML =
      "<tr><td colspan='5'>Failed to load data.</td></tr>";
  }
});
