import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext/UserProvider.js";
import Menu from "../../Common/Menu.js";
import MainSection from "./Mainsections.js";
import SearchAndCategories from "./Search.js";

import '../../App.css';

function HomePage() { 
    const appStyle = {
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
      };

    return (
      <div style={{...appStyle, justifyContent: 'space-between', width: '100%'}}>
        <Menu />
        <MainSection />
        <SearchAndCategories />
      </div>
    );
  }

export default HomePage;