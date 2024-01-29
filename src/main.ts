import { Kafka, Partitioners } from "kafkajs"

console.log('\n========== ⚡ BOOTING UP ⚡ =========== \n')

async function boot() {
    try {
        const host = process.env.HOST_IP

        const kafka = new Kafka({
            clientId: 'leesah-game-starter-js',
            brokers: [`${host}:9092`]
        })

        const producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner })

        await producer.connect()
        
        await producer.send({topic: 'topic-test', messages: [{value: 'Hello kafka!'}]})

    } catch(error) {
        console.log('\n\n=========== 💥  TERROR 💥  ============\n\n')
        console.log(error)
    }
}

void boot()