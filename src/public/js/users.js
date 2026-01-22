console.log("Users frontend javascript file");

$(function () {
    $(".member-status").on("change", function (e) {
      const id = e.target.id,
      memberStatus = $(`#${id}.member-status`).val();

      // TODO: Axios updateChosenUser

      axios.post("/admin/user/edit", {
        _id: id,
        memberStatus: memberStatus,
      })
      .then((response) => {
        console.log("response:", response);
        const result = response.data;
        
        if(result.data) {
            $(".member-status").blur();   // blur() --> biror input yoki elementdan fokusni olib tashlaydi.
        } else alert("User update failed!");
      })
      .catch((err) => {
        console.log(err);
        alert("User update failed!");
      });

    });
});


document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('searchButton');
  const resetButton = document.getElementById('resetButton');
  const searchInput = document.getElementById('searchInput');
  const usersTable = document.getElementById('usersTable');
  const userCount = document.getElementById('userCount'); // count element

  function updateCount() {
    const rows = usersTable.getElementsByTagName('tbody');
    let visibleCount = 0;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].style.display !== 'none') visibleCount++;
    }
    userCount.textContent = `Total: ${visibleCount}`;
  }

  searchButton.addEventListener('click', () => {
    const filter = searchInput.value.toLowerCase();
    const rows = usersTable.getElementsByTagName('tbody');

    for (let i = 0; i < rows.length; i++) {
      const nameCell = rows[i].querySelector('.user-name');
      const nameText = nameCell.textContent.toLowerCase();

      rows[i].style.display = nameText.includes(filter) ? '' : 'none';
    }

    updateCount(); // countni yangilash
  });

  resetButton.addEventListener('click', () => {
    searchInput.value = '';
    const rows = usersTable.getElementsByTagName('tbody');
    for (let i = 0; i < rows.length; i++) {
      rows[i].style.display = '';
    }

    updateCount(); // countni yangilash
  });

  // Sahifa yuklanganda ham count to'g'ri chiqadi
  updateCount();
});
