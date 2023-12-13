import { city } from '../../../data/city'

export default function handler(req: any, res: any) {
    res.status(200).json(city)
}

