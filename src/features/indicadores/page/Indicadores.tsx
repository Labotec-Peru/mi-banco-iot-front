import PageContainer from "../../../layouts/PageContainer";


export default function Users() {
    return (
        <PageContainer>
            <div style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <iframe
                    src={import.meta.env.VITE_POWERBI_URL}
                    title="dashboardPB"
                    style={{ width: "100%", height: "100%", border: "none" }}
                    allowFullScreen
                ></iframe>
            </div>
        </PageContainer>
    );
}