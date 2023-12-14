import { province } from '../../../data/province'

export default function handler(req: any, res: any) {
    res.status(200).json(province)
}

