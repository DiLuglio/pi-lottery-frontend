document.addEventListener("DOMContentLoaded", function () {
    // Controlliamo se il Pi SDK è caricato correttamente
    if (typeof Pi !== "undefined") {
        console.log("Pi SDK is loaded!");
        Pi.init({ version: "2.0" });
    } else {
        console.error("Pi SDK not loaded. Check index.html!");
    }

    const loginBtn = document.getElementById("loginBtn");
    const joinBtn = document.getElementById("joinLottery");
    const entryFeeDisplay = document.getElementById("entryFee");
    const statusDisplay = document.getElementById("status");

    let username = "";
    let entryFeePi = 0;

    async function fetchEntryFee() {
        try {
            const response = await fetch("https://pi-lottery.onrender.com/entry_fee");
            const data = await response.json();
            entryFeePi = data.entry_fee_pi;
            entryFeeDisplay.innerText = `Today's Entry Fee: ${entryFeePi} Pi`;
        } catch (error) {
            console.error("Error fetching entry fee:", error);
        }
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

            const response = await fetch("https://pi-lottery.onrender.com/join", {
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
