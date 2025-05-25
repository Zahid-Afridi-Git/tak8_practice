

const Loader = () => {
  return (
    <div class="anim-logo-container">
      <img src="img/logo2.png" alt="TAK8 Logo" class="anim-logo" />
    </div>
  );
};
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#fff', // Optional: backdrop color
  },
  gif: {
    width: '80px', // Customize size
    height: '80px',
  }
};
export default Loader;