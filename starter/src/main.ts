import { Kafka, KafkaConfig, Partitioners } from "kafkajs"
import { Answer, MessageType, Question } from "./types"
import { v4 as uuidv4 } from 'uuid';
import YAML from 'yaml'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

const certsYAMLAsJSON = process.env.IS_NAIS ? YAML.parse(fs.readFileSync('../certs/leesah-quiz-certs.yaml', 'utf-8')) : undefined

const TEAM_NAME = "Perkelator"
const HEX_CODE = "FA8072"

const QUIZ_TOPIC = certsYAMLAsJSON.topics[0] ?? "topic-test"

const BROKER_URL = certsYAMLAsJSON.broker ?? `${process.env.HOST_IP}:9092`
const CONSUMER_GROUP_ID = process.env.IS_NAIS ? `new-group-${Math.random()}` : "test-group"
const CLIENT_ID = `leesah-game-${TEAM_NAME}`


console.log('\n========== ⚡ BOOTING UP ⚡ =========== \n')

async function boot() {
    try {
        if (!BROKER_URL) throw new Error(`Broker url er feil! Broker url: ${BROKER_URL}`)

        const kafka = new Kafka({
            clientId: CLIENT_ID,
            brokers: [BROKER_URL],
            ssl: process.env.IS_NAIS ? {
                rejectUnauthorized: false,
                ca: [certsYAMLAsJSON.ca],
                key: certsYAMLAsJSON.user.access_key,
                cert: certsYAMLAsJSON.user.access_cert
            } : undefined
        })


        // TODO: konverter til en loader klasse som returnerer en consumer og en broker som er koblet til topicet
        // TODO: få en skikkelig feilmelding på feil svar i assesment casen
        const consumer = kafka.consumer({ groupId: CONSUMER_GROUP_ID })
        
        await consumer.connect()
        await consumer.subscribe({ topic: QUIZ_TOPIC, fromBeginning: true })

        const producer = kafka.producer()
        await producer.connect()

        await consumer.run({
            eachMessage: async ({ message }) => {
                if (message.value) {
                    const parsedMessage = JSON.parse(message.value?.toString())
                    switch(parsedMessage.type) {
                        case MessageType.Question: {
                            const questionMessage: Question = parsedMessage
                            if (questionMessage.category === "team-registration") {
                        
                                const answer: Answer = {
                                    messageId: uuidv4().toString(),
                                    type: MessageType.Answer,
                                    created: new Date().toISOString(),
                                    questionId: questionMessage.messageId,
                                    category: questionMessage.category,
                                    teamName: TEAM_NAME,
                                    answer: HEX_CODE
                                }
                                await producer.send({ topic: QUIZ_TOPIC, messages: [{ value: JSON.stringify(answer) }]})
                            }
                            break
                        }
                        // TODO: figure out if these are even needed...
                        case MessageType.Answer: {
                            //console.log('KOM MEG HIT JOHO!!!!!!!!')
                            break
                        }
                        case MessageType.Assessment: {
                            //parsedMessage.category === "team-registration" && console.log(parsedMessage)
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