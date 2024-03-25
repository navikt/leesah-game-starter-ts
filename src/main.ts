import { MessageType, Question } from "./types";
import { answerQuestion, loadKafka } from "./utils/kafka";
import { logJSON, logYellow } from "./utils/logger";

const TEAM_NAME = "Perkelator";
const HEX_CODE = "FA8072";

console.log("\n========== ⚡ BOOTING UP ⚡ =========== \n");

async function boot() {
  try {
    const { consumer } = await loadKafka(TEAM_NAME);

    await consumer.run({
      eachMessage: async ({ message }) => {
        if (message.value) {
          const parsedMessage = JSON.parse(message.value?.toString());
          logJSON(parsedMessage);
          if (parsedMessage.type === MessageType.Question) {
            const question: Question = parsedMessage;

            logYellow("Nytt spørsmål!");
            logJSON({
              kategori: question.category,
              spørsmål: question.question,
            });

            if (question.category === "team-registration") {
              await answerQuestion(question, HEX_CODE);
            } else if (question.category === "kjempekul kategoro") {
              // SVAR VIDERE HER ...
            }
          }
        } else {
          console.error("Kafka meldingen har ingen verdi!");
        }
      },
    });
  } catch (error) {
    console.log("\n\n=========== 💥  TERROR 💥  ============\n\n");
    console.log(error);
  }
}

void boot();
