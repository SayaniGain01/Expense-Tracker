function SignUp(){
    return(
        <div className="flex flex-col bg-white">
            <img src="logo1.png" alt="logo1" className="w-50 h-50" />
            <form className="flex flex-col">
                <input className="border border-gray-500 rounded-sm mb-5 p-1.5 text-sm w-64 mx-6" type="name" id="name" placeholder="Name"/>

                <input className="border border-gray-500 rounded-md mb-5 p-1.5 text-sm w-64 mx-6" id="email" type="email" placeholder="Email" />

                <input className="border border-gray-500 rounded-md mb-5 p-1.5 text-sm w-64 mx-6" id="password" type="password" placeholder="Enter New Password" />

                <input className="border border-gray-500 rounded-md mb-8 p-1.5 text-sm w-64 mx-6" id="password" type="password" placeholder="Retype Password" />

                <button className="w-64 mx-6 bg-teal-700 shadow-lg shadow-gray-500/50 text-sm text-white rounded-sm py-1 mb-1.5 cursor-pointer">Sign Up</button>

            </form>
        </div>
    )
}
export default SignUp