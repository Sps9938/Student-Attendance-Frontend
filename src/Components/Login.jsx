import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { login as authLogin } from '../store/authSlice';
import { Button, Input } from './index';
import { useDispatch } from "react-redux";
import { useForm } from 'react-hook-form';
import axios from "axios";
import conf from "../Conf/Conf"; 

function Login() {
    // console.log("welcome to Login Page");
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState("");

    const login = async (data) => {
        console.log("welcome to login form->after submit");
        console.log("client sent data: ", data);
        const API = conf.API_URL;
        console.log("Backend port listen At: ",  API);

        setError("");
        try {
            console.log(`Backend URL is: ${API}/user/login`);
            
            const response = await axios.patch(`${API}/user/login`, {
                email: data.email,
                password: data.password
            }, {
                withCredentials: true
            })

            if(response){
                const userData = await axios.get(`${conf.API_URL}/user/get-user`,{
                    withCredentials: true
                })
                console.log("cureent user: ", userData);
                
            }
            else{
                console.log("Failed Fetched userData");
                
            }
            console.log("Response by client side: ", response);
            
            const result = response.data;

            console.log("localhost set By Backend: ", response);
            
            if (result.success) {

                const { accessToken, refreshToken, user } = result.data;
                // Save token to localStorage or cookie
                localStorage.setItem("accessToken",accessToken);
                localStorage.setItem("refreshToken",refreshToken);


                // Dispatch user data to Redux
                dispatch(authLogin(user)); // result.user must contain your user info

                // Navigate to homepage
                navigate("/");
            } else {
                setError(result.message || "Login failed");
            }
        } catch (err) {
            console.error("Login error", err);
            setError(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
    <div className="flex items-center justify-center w-full">
    <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
        <div className="mb-2 flex justify-center">
        <span className="inline-block w-full max-w-[100px]">
            {/* <Logo width="100%" /> */}
        </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
        <p className="mt-2 text-center text-base text-black/60">
        Don&apos;t have an account?&nbsp;
        <Link to="/signup" className="font-medium text-primary transition-all duration-200 hover:underline">
            Sign Up
        </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        <form onSubmit={handleSubmit(login)} className="mt-8">
        <div className="space-y-5">
        <Input
        label="email: "
        placeholder="Enter your email"
        type="email"
        {...register("email", {
        required: true,
        validate: {
            matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
            "Email address must be a valid address",
        }

        })}
        />
        <Input
        label="password: "
        type="password"
        placeholder="Enter your password"
        {...register("password", {
            required: true,
        })}
        />
        <Button 
        type="submit" 
        className="w-full">
            Sign in</Button>
        </div>
        </form>
        </div>
        </div>
    );
}

export default Login;
