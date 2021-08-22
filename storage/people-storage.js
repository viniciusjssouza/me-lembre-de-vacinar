import AWS from 'aws-sdk';

const PEOPLE_TABLE = process.env.PEOPLE_TABLE;

export default class PeopleStorage {

  constructor() {
    const dynamoDbClientParams = {};
    if (process.env.IS_OFFLINE) {
      dynamoDbClientParams.region = 'localhost'
      dynamoDbClientParams.endpoint = 'http://localhost:8000'
    }
    this.dynamoDbClient = new AWS.DynamoDB.DocumentClient(dynamoDbClientParams);
  }

  async findByCpf(cpf) {
    const params = {
      TableName: PEOPLE_TABLE,
      Key: {
        cpf,
      },
    };
    const { Item } = await this.dynamoDbClient.get(params).promise();
    return this.itemToPerson(Item);
  }

  itemToPerson(item) {
    if (!item) {
      return null;
    }
    return {
      cpf: item.cpf,
      name: item.name,
      phoneNumber: item.phone_number,
      nextShotDate: item.next_shot_date,
      last_shot_date: item.last_shot_date,
      vaccine: item.vaccine,
      status: item.status
    }
  }
}
