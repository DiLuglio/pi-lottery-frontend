const BACKEND_URL = "https://pi-lottery.onrender.com";  // Cambia se necessario

document.addEventListener("DOMContentLoaded", async function () {
    Pi.init({ version: "2.0" });

    const loginBtn = document.getElementById("loginBtn");
    const joinBtn = document.getElementById("joinLottery");
    const entryFeeDisplay = document.getElementById("entryFee");
    const statusDisplay = document.getElementById("status");

    let username = "";
    let entryFeePi = 0;

    async function fetchEntryFee() {
        const response = await fetch(`${BACKEND_URL}/entry_fee`);
        const data = await response.json();
        entryFeePi = data.entry_fee_pi;
        entryFeeDisplay.innerText = `Today's Entry Fee: ${entryFeePi} Pi`;
    }

    loginBtn.addEventListener("click", async function () {
        try {
            const scopes = ["username"];
            const auth = await Pi.authenticate(scopes, (res) => console.log(res));

            if (auth.user) {
                username = auth.user.username;
                loginBtn.style.display = "none";
                joinBtn.style.display = "block";
            }
        } catch (error) {
            console.error("Authentication error:", error);
        }
    });

    joinBtn.addEventListener("click", async function () {
        try {
            const payment = await Pi.createPayment({
                amount: entryFeePi,
                memo: "Lottery Entry",
                metadata: { username },
                to: "lottery_admin"
            });

            const response = await fetch(`${BACKEND_URL}/join`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username })
            });

            const result = await response.json();
            statusDisplay.innerText = result.message;

        } catch (error) {
            console.error("Payment error:", error);
        }
    });

    fetchEntryFee();
});
