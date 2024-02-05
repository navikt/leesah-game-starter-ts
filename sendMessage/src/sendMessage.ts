import { Kafka, Partitioners } from "kafkajs";
import { v4 as uuidv4 } from 'uuid';

export enum MessageType {
    Question = "QUESTION",
    Answer = "ANSWER",
    Assessment = "ASSESSMENT"
}

export enum AssessmentStatus {
    Success = "SUCCESS",
    Failure = "FAILURE"
}

interface LeesahMessage {
    messageId: string
    type: MessageType
    created: string
}

export interface Question extends LeesahMessage {
    category: string
    question: string
}

export interface Answer extends LeesahMessage {
    questionId: string
    teamName: string
    answer: string
}

export interface Assessment extends LeesahMessage {
    questionId: string
    answerId: string
    type: MessageType
    category: string
    teamName: string
    status: AssessmentStatus
    sign: string
}

async function sendMessageToTopic() {

    const host = process.env.HOST_IP
    
    const kafka = new Kafka({
        clientId: 'leesah-game-CHANGE-ME',
        brokers: [`${host}:9092`]
    })
    
    const producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner })

    await producer.connect()

    const testQuestion: Question = {
        messageId: uuidv4(),
        type: MessageType.Question,
        created: new Date().toISOString(),
        category: "team-registration",
        question: "Hva er navnet på ditt råbra team?"
    }

    await producer.send({topic: 'topic-test', messages: [{value: JSON.stringify(testQuestion)}]})

    process.exit(0)
}    

sendMessageToTopic()
