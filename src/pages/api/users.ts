///EXEMPLO

import { NextApiRequest, NextApiResponse } from 'next'

// JWT (Storage)
// Next Auth (Social Facebook, Google...)
// Cognito, Auth0

export default (req: NextApiRequest, res:NextApiResponse) => {
    const users = [
        {id: 1, name: 'Diego'},
        {id: 2, name: 'Dani'},
        {id: 3, name: 'Rafa'},
    ]

    return res.json(users)
}