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
   


    $("#product-search").on("keyup", function () {
  const value = $(this).val().toLowerCase();

  $("table tbody").each(function () {
    const productType = $(this).find("td:nth-child(3)").text().toLowerCase();
    $(this).toggle(productType.includes(value));
  });
});





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

// function validateForm() {
//     const productName = $(".product-name").val();
//     const productPrice = $(".product-price").val();
//     const productLeftCount = $(".product-left-count").val();
//     const productCollection = $(".product-collection").val();
//     const productDesc = $(".product-desc").val();
//     const productStatus = $(".product-status").val();
   



//     if (
//         productName === "" ||
//         productPrice === "" ||
//         productLeftCount === "" ||
//         productCollection === "" ||
//         productDesc === "" ||
//         productStatus === ""
    
//     ) {
//         alert("Please insert all detailes!");
//         return false;
//     } else return true;
// }


function openEditForm(productData) {
    const product = JSON.parse(productData);
    const form = document.getElementById('new-product-form');
    
    // Formani ko'rsatish
    form.style.display = 'block';
    
    // Action-ni update API-ga o'zgartirish
    form.action = `/admin/product/update/${product._id}`;
    
    // Tugma matnini o'zgartirish
    document.getElementById('create-btn').innerText = "Update Product";
    document.querySelector('.new-dish-txt').innerText = "UPDATE PRODUCT DETAIL";

    // Inputlarni mahsulot ma'lumotlari bilan to'ldirish
    form.querySelector('.product-name').value = product.productName;
    form.querySelector('.product-price').value = product.productPrice;
    form.querySelector('.product-left-count').value = product.productLeftCount;
    form.querySelector('.product-collection').value = product.productCollection;
    form.querySelector('.product-size[name="productGender"]').value = product.productGender;
    form.querySelector('.product-size[name="productAge"]').value = product.productAge;
    form.querySelector('.product-desc').value = product.productDesc;

    // Rasmlar majburiy emas (Update-da rasmni o'zgartirmasligi ham mumkin)
    form.querySelector('.image-one').required = false;

    // Sahifani tepaga surish (formani ko'rish uchun)
    form.scrollIntoView({ behavior: 'smooth' });
}

// Cancel bosilganda formani qayta tiklash
document.getElementById('cancel-btn').addEventListener('click', (e) => {
    e.preventDefault();
    const form = document.getElementById('new-product-form');
    form.style.display = 'none';
    form.reset();
    form.action = "/admin/product/create";
    document.getElementById('create-btn').innerText = "Create";
});



function validateForm() {
    const productName = $(".product-name").val();
    const productPrice = $(".product-price").val();
    const productLeftCount = $(".product-left-count").val();
    const productCollection = $(".product-collection").val();
    const productDesc = $(".product-desc").val();
    const productStatus = $(".product-status").val();
   
    const productAge = $(".product-size[name='productAge']").val(); 

    if (
        productName === "" ||
        productPrice === "" ||
        productLeftCount === "" ||
        productCollection === "" ||
        productDesc === "" ||
        productStatus === "" ||
        !productAge
    ) {
        alert("Please insert all details!");
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