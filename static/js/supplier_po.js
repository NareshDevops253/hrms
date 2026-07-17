console.log("Supplier PO JS Loaded");


// Load Supplier MSA Dropdown

function loadSupplierMSA(){


fetch("/supplier_msa_active")

.then(response=>response.json())

.then(data=>{


let dropdown=
document.getElementById("supplier_msa_id");


dropdown.innerHTML=
'<option value="">Select Supplier MSA</option>';



data.forEach(msa=>{


dropdown.innerHTML +=

`
<option value="${msa.id}">

${msa.supplier_name}
-
${msa.msa_number}

</option>

`

});


});


}



// Save Supplier PO


function saveSupplierPO(){


let data={


supplier_msa_id:
document.getElementById("supplier_msa_id").value,


po_number:
document.getElementById("po_number").value,


project_name:
document.getElementById("project_name").value,


start_date:
document.getElementById("start_date").value,


end_date:
document.getElementById("end_date").value,


amount:
document.getElementById("amount").value,


status:
document.getElementById("status").value


};



fetch("/supplier_po",
{


method:"POST",


headers:
{
"Content-Type":"application/json"
},


body:JSON.stringify(data)


})


.then(res=>res.json())


.then(data=>{


alert(data.message);

loadSupplierPO();


});



}



// Load Supplier PO


function loadSupplierPO(){


fetch("/supplier_po")

.then(res=>res.json())


.then(data=>{


let table=
document.getElementById("supplier_po_table");


table.innerHTML="";



data.forEach(po=>{


table.innerHTML +=`


<tr>


<td>${po.id}</td>


<td>${po.supplier_name}</td>


<td>${po.po_number}</td>


<td>${po.project_name}</td>


<td>${po.amount}</td>


<td>${po.status}</td>



<td>


<button onclick="deleteSupplierPO(${po.id})">

Delete

</button>


</td>


</tr>


`;


});


});


}



// Delete


function deleteSupplierPO(id){


fetch("/supplier_po/"+id,
{

method:"DELETE"

})


.then(res=>res.json())


.then(data=>{


alert(data.message);


loadSupplierPO();


});


}



window.onload=function(){

loadSupplierMSA();

loadSupplierPO();

}