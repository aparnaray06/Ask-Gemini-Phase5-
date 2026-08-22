
const input = document.getElementById("input");
const generateBtn = document.getElementById("generateBtn")

const answerText = document.getElementById("prompt")

generateBtn.addEventListener("click", async()=>{
    const question = input.value;

    if (!question){
        answerText.textContent = "please type question";
        return;
    }
    answerText.textContent = "Generating your answer...";

    try{
        const response = await fetch("/ask-gemini",
            {
                method: "POST",
                headers:{
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    question: question
                })
            }
        );
        const data = await response.json();
        if (!response.ok){
            throw new Error(data.error||"Something went wrong");
            
        }
        answerText.textContent = data.answer;

    }
    catch(error){
        console.log(error);
        answerText.textContent = "Unable to generate the answer, Please try again"
        
    }
})

