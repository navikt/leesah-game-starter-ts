import { Kafka, Partitioners } from "kafkajs"
import { Answer, MessageType, Question } from "./types"
import { v4 as uuidv4 } from 'uuid';

const TEAM_NAME = "CHANGE ME"
const HEX_CODE = "CHANGE ME"
// TODO: change this based on localhost or NAIS
const QUIZ_TOPIC = "topic-test"
const CONSUMER_GOUP_ID = "test-group"


console.log('\n========== ⚡ BOOTING UP ⚡ =========== \n')

async function boot() {
    try {
        const host = process.env.HOST_IP
        
        if (!host) throw new Error("HOST er ikke satt!")

        const kafka = new Kafka({
            clientId: `leesah-game-${TEAM_NAME}`,
            brokers: [`${host}:9092`]
        })

        const consumer = kafka.consumer({ groupId: CONSUMER_GOUP_ID })
        
        await consumer.connect()
        await consumer.subscribe({ topic: QUIZ_TOPIC })

        await consumer.run({
            eachMessage: async ({ message }) => {
                if (message.value) {
                    const parsedMessage = JSON.parse(message.value?.toString())
                    switch(parsedMessage.type) {
                        case MessageType.Question: {
                            const questionMessage: Question = parsedMessage
                            if (questionMessage.category == "team-registration") {
                                // TODO: Post answer with producer
                                const answer: Answer = {
                                    messageId: uuidv4(),
                                    type: MessageType.Answer,
                                    created: new Date().toISOString(),
                                    questionId: questionMessage.messageId,
                                    teamName: TEAM_NAME,
                                    answer: TEAM_NAME
                                }
                                console.log(answer)
                            }
                            break
                        }
                        // TODO: figure out if these are even needed...
                        case MessageType.Answer: {
                            console.log(parsedMessage)
                            break
                        }
                        case MessageType.Assessment: {
                            console.log(parsedMessage)
                            break
                        }
                        default: {
                            console.error(`Fant ikke kafka melding av riktig type, meldings-type: ${MessageType}`)
                            console.error(parsedMessage)
                        }
                    }

                }
            },
          })

    } catch(error) {
        console.log('\n\n=========== 💥  TERROR 💥  ============\n\n')
        console.log(error)
    }
}

void boot()