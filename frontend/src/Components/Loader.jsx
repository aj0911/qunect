import React from "react";
import '../index.css'

const Loader = ({ size, fullWidth = false, fullHeight = false }) => {
  return (
    <div
      className="loader"
      style={{
        width: fullWidth ? "100%" : "auto",
        height: fullHeight ? "100vh" : "auto",
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'var(--bgColor)'
      }}
    >
      <div className="spinner" style={{
        width:size,
        height:size,
        borderBottom:'2px solid var(--secColor)',
        borderRadius:'50%',
        animation:'animateLoader 1s linear infinite'
      }}></div>
    </div>
  );
};

export default Loader;
