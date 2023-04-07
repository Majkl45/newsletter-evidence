const Header = () => {
  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "4.5rem",
  }

  return (
    <>
      <header className="ms-bgColor-themePrimary" style={headerStyle}>
        <h1 className="ms-fontColor-white">Newsletter evidence</h1>
      </header>
    </>
  );
}

export default Header