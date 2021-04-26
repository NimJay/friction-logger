import style from './style.css';

const SecretIdSection = ({ secretId }) => (
  <section className={style.SecretIdSection}>
    <h2>Secret ID</h2>
    <p>
      Here's the secret ID of this Friction Log:
      <span>{secretId}</span>
    </p>
    <p>
      You will need this when using the Chrome Extension.
    </p>
  </section>
);

export default SecretIdSection;
