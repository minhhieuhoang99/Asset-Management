import { Layout } from "antd";
import "antd/dist/antd.css";
import { Link } from "react-router-dom";
import { useState, useContext } from "react"
import CurrentHeaderContext from "../../Shared/Constant/Context/CurrentHeaderContext";
import SecondHeaderContext from "../../Shared/Constant/Context/SecondHeaderContext";
import "./SideBar.css";
import {
  Menu,
  Image,
  Typography
} from "antd";
import CurrentUserContext from "../../Shared/Constant/Context/CurrentUserContext"
const { Text } = Typography;
const { Sider } = Layout;
const SideBar = () => {

  const { currentUser, setCurrentUser } = useContext(CurrentUserContext)
  const { setCurrentHeader } = useContext(CurrentHeaderContext);
  const { setSecondHeader } = useContext(SecondHeaderContext);

  // Get saved data from sessionStorage
  let dataKey = sessionStorage.getItem('key');
  //setKey(dataKey);
  const Home = () => {
    setCurrentHeader("Home");
    setSecondHeader();
    sessionStorage.setItem('key', '1'); // Save data to sessionStorage
  };
  const ManageUser = () => {
    setCurrentHeader("Manage User");
    setSecondHeader();
    sessionStorage.setItem('key', '2'); // Save data to sessionStorage
  };
  const ManageAsset = () => {
    setCurrentHeader("Manage Asset");
    setSecondHeader();
    sessionStorage.setItem('key', '3'); // Save data to sessionStorage
  };
  const ManageAssignment = () => {
    setCurrentHeader("Manage Assignment");
    setSecondHeader();
    sessionStorage.setItem('key', '4'); // Save data to sessionStorage
  };
  const ManageReturnRequest = () => {
    setCurrentHeader("Request for returning");
    setSecondHeader();
    sessionStorage.setItem('key', '5'); // Save data to sessionStorage
  };
  const Report = () => {
    setCurrentHeader("Report")
    setSecondHeader();
    sessionStorage.setItem('key', '6'); // Save data to sessionStorage
  }
  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      {currentUser.role === 'Admin' ? <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={broken => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >

        <div className="logo"><Image preview={false} src="https://nashtechglobal.com/wp-content/uploads/2020/04/logo.png" ></Image></div>
        <h1>Online Asset Management</h1>
        <Menu mode="inline" defaultSelectedKeys={[`${dataKey}`]}>
          <>
            <Menu.Item key="1"><Link to={`/`} onClick={Home}><Text strong>Home</Text></Link></Menu.Item>
            <Menu.Item key="2"><Link to={`/list-user`} onClick={ManageUser}><Text strong>Manage User</Text></Link></Menu.Item>
            <Menu.Item key="3"><Link to={`/list-asset`} onClick={ManageAsset}><Text strong>Manage Assest</Text></Link></Menu.Item>
            <Menu.Item key="4"><Link to={`/list-assignment`} onClick={ManageAssignment}><Text strong>Manage Assignment</Text></Link></Menu.Item>
            <Menu.Item key="5"><Link to={`/list-returnRequest`} onClick={ManageReturnRequest}><Text strong>Request for Returning</Text></Link></Menu.Item>
            <Menu.Item key="6"><Link to={`/list-report`} onClick={Report}><Text strong>Report</Text></Link></Menu.Item>
          </>
        </Menu>

      </Sider>
        :
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={broken => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div className="logo"><Image preview={false} src="https://nashtechglobal.com/wp-content/uploads/2020/04/logo.png" ></Image></div>
          <h1>Online Asset Management</h1>
          <Menu mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1"><Link to={`/`} ><Text strong>Home</Text></Link></Menu.Item>
          </Menu>
        </Sider>}
    </CurrentUserContext.Provider>
  )
};

export default SideBar;