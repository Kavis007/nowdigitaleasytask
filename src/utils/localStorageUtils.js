export const getMenusFromStorage = () => {
    const data = localStorage.getItem("menus");
    return data ? JSON.parse(data) : [];
  };
  
  export const saveMenusToStorage = (menus) => {
    localStorage.setItem("menus", JSON.stringify(menus));
  };
  