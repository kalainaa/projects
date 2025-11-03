import { useDispatch } from "react-redux";
import { openModal } from "@/redux/Slices/modalSlice";
import style from "./navFooter.module.css";
import Link from "next/link";

export default function NavFooter() {
    const dispatch = useDispatch();

    const handleOpenModal = () => {
        dispatch(openModal({
            modalName: 'userFeedbackModal',
        }));
    }

    return (
        <div className={style.bottomSection}>
            <div className={style.feedbackHelp}>
                <button className={style.feedbackButton} onClick={handleOpenModal}>Share your feedback</button>
                <button className={style.helpButton}><Link href="/help" target="_blank">Need Help?</Link></button>
            </div>
            <div className={style.legalLinks}>
                <Link href="/terms-of-service" target="_blank" className={style.termsLink}>Terms of use</Link>
                <Link href="/privacy-policy" target="_blank" className={style.privacyLink}>Privacy policy</Link>
            </div>
        </div>
    );
}
