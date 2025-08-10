export async function fetchUserInfo(){
    const response= await fetch("http://localhost:8000/user",{
        method: "GET",
        headers:{
            "Content-Type":"application/json"
        },
        credentials:"include"
    });
    const data = await response.json();
    console.log(data)
    return data.data
}
