import { Kafka, Partitioners } from "kafkajs"

enum MessageType {
    Question = "QUESTION",
    Answer = "ANSWER",
    Assessment = "ASSESSMENT"
}

enum AssessmentStatus {
    Success = "SUCCESS",
    Failure = "FAILURE"
}

interface LeesahMessage {
    messageId: string
    type: MessageType
    created: string
}

interface Question extends LeesahMessage {
    category: string
    question: string
}

interface Answer extends LeesahMessage {
    questionId: string
    teamName: string
    answer: string
}

interface Assessment extends LeesahMessage {
    questionId: string
    answerId: string
    type: MessageType
    category: string
    teamName: string
    status: AssessmentStatus
    sign: string
}

console.log('\n========== ⚡ BOOTING UP ⚡ =========== \n')

async function boot() {
    try {
        const host = process.env.HOST_IP
        
        if (!host) throw new Error("HOST er ikke satt!")

        const kafka = new Kafka({
            clientId: 'leesah-game-starter-js',
            brokers: [`${host}:9092`]
        })

        const topic = 'topic-test'
        const consumer = kafka.consumer({ groupId: 'test-group' })
        
        await consumer.connect()
        await consumer.subscribe({ topic, fromBeginning: true })

        await consumer.run({
            eachMessage: async ({ message }) => {
                if (message.value) {
                    const parsedMessage = JSON.parse(message.value?.toString())
                    switch(parsedMessage.type) {
                        case MessageType.Question: {
                            const questionMessage: Question = parsedMessage
                            if (questionMessage.category == "team-registration") {
                                // TODO: Post answer with consumer
                            }
                            break
                        }
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