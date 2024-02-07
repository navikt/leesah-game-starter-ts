import { Kafka, KafkaConfig, Partitioners } from "kafkajs"
import { Answer, MessageType, Question } from "./types"
import { v4 as uuidv4 } from 'uuid';
import { answerQuestion, loadKafka } from "./utils/kafka";

const TEAM_NAME = "Perkelator"
const HEX_CODE = "FA8072" 

console.log('\n========== ⚡ BOOTING UP ⚡ =========== \n')

async function boot() {
    try {
        const { consumer, producer } = await loadKafka(TEAM_NAME)

        await consumer.run({
            eachMessage: async ({ message }) => {
                if (message.value) {
                    const parsedMessage = JSON.parse(message.value?.toString())
                    if (parsedMessage.type === MessageType.Question) {
                        const question: Question = parsedMessage
                        // TODO: log som JSON
                        console.log(`Kategori: ${question.category}, Spørsmål: ${question.question}`)
    
                        if (question.category === "team-registration") {
                            await answerQuestion(producer, TEAM_NAME, question, HEX_CODE)
                        } else if (question.category === "kjempekul kategoro") {
                            // SVAR VIDERE HER ...
                        }
                    }
                } else {
                    console.error('Kafka meldingen har ingen verdi!')
                }
            },
          })

    } catch(error) {
        console.log('\n\n=========== 💥  TERROR 💥  ============\n\n')
        console.log(error)
    }
}

void boot()