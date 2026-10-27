import styles from "./styles.module.scss";
import { MoonLoader } from "react-spinners";

export default function DotLoaderSpinner({ loading }) {

    return (
        <div className={styles.loader}>
            <MoonLoader color="#2f82ff" loading={loading} />
        </div>
    );
}
