console.log("Products frontend javascript file");



document.getElementById('process-btn').onclick = function() {
  document.getElementById('new-product-form').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
}
document.getElementById('cancel-btn').onclick = function(e) {
  e.preventDefault();
  document.getElementById('new-product-form').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}




$(function () {
    $(".product-collection").on("change", () => {
        const selectedValue = $(".product-collection").val();
        if(selectedValue === "DRINK") {
            $("#product-collection").hide();  //`hide()` elementi **ko‘rinmas qilib yashiradi** (display: none qo‘yadi).
            $("#product-volume").show();      //`show()` — oldin yashirilgan elementni **yana ko‘rsatadi** (display qiymatini tiklaydi).

        } else {
             $("#product-volume").hide();        //`hide()` elementi **ko‘rinmas qilib yashiradi** (display: none qo‘yadi).
            $("#product-collection").show();     //`show()` — oldin yashirilgan elementni **yana ko‘rsatadi** (display qiymatini tiklaydi).

        }
    });


    $("#product-search").on("keyup", function () {
  const value = $(this).val().toLowerCase();

  $("table tbody").each(function () {
    const productType = $(this).find("td:nth-child(3)").text().toLowerCase();
    $(this).toggle(productType.includes(value));
  });
});



    // $("#process-btn").on("click", () => {
    //     $(".dish-container").slideToggle(500);
    //     $("#process-btn").css("display", "none");  
    // });

    //     $("#cancel-btn").on("click", () => {
    //     $(".dish-container").slideToggle(300);
    //     $("#process-btn").css("display", "flex");
    // });


    $(".new-product-status").on("change", async function(e) {
    const id = e.target.id;
    const productStatus = $(`#${id}.new-product-status`).val();
    
    try {
        const response = await axios.post(`/admin/product/${id}`, {
            productStatus: productStatus
        });
        
        console.log("response:", response);
        const result = response.data;
        if (result.data) {
         $(".new-product-status").blur();
        } else {
            alert("Product update failed!");
        }
    } catch (err) {
        console.log(err);
        alert("Product update failed!");
    }
});


});

function validateForm() {
    const productName = $(".product-name").val();
    const productPrice = $(".product-price").val();
    const productLeftCount = $(".product-left-count").val();
    const productCollection = $(".product-collection").val();
    const productDesc = $(".product-desc").val();
    const productStatus = $(".product-status").val();
   



    if (
        productName === "" ||
        productPrice === "" ||
        productLeftCount === "" ||
        productCollection === "" ||
        productDesc === "" ||
        productStatus === ""
    
    ) {
        alert("Please insert all detailes!");
        return false;
    } else return true;
}

function previewFileHandler(input, order) {
    const imgClassName = input.className;
    console.log("input:", input)

    const file = $(`.${imgClassName}`).get(0).files[0];
    const fileType = file['type'];
    const validImageType = ["image/jpg", "image/jpeg", "image/png"];

     if (!validImageType.includes(fileType)) {
        alert("Please insert only jpg, jpeg and png!");
      } else {
        if(file) {
            const reader = new FileReader();
            reader.onload = function () {
                $(`#image-section-${order}`).attr("src", reader.result);
            };
            reader.readAsDataURL(file);
        }
      }
}