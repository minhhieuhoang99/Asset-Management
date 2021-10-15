import {React,useContext} from "react";
import "antd/dist/antd.css";
import { Image } from "antd";
import ViewOwnASM from "../../Components/ViewOwnASM/ViewOwnASM"
import CurrentUserContext from "../../Shared/Constant/Context/CurrentUserContext"
const HomeDemoPage = () => {
  const {currentUser, setCurrentUser } = useContext(CurrentUserContext);
  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      { currentUser.role === null || currentUser.role === undefined?      
      <Image style={{ width: 500 , textAlign:'center' }} src="https://image.thanhnien.vn/1024/uploaded/quochung.qc/2020_01_16/nashtech/nash_tech_primary_pos_srgb_oycj.png" ></Image>
      :<ViewOwnASM/>}
    </div>
  );
};

export default HomeDemoPage;