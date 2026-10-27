import { getSession } from "next-auth/react";
import Layout from "../../components/profile/layout";
import Footer from "../../components/footer";

export default function profile({ user, tab }) {

    return (
        <>
            <Layout session={user.user} tab={tab} />
        </>
    );

}

export async function getServerSideProps(ctx) {
    const { query, req } = ctx;
    const session = await getSession({ req });
    const tab = query.tab || 0;
    return {
        props: { user: session, tab },
    };
}
