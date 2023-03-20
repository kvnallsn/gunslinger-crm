import { runDatabaseTx, SqlClient } from '@/lib/db';
import AddGroupMemberForm, { AddGroupMemberFormSchema } from '@/lib/forms/group-addmember';
import DelGroupMemberForm, { DelGroupMemberFormSchema } from '@/lib/forms/group-delmember';
import Group from '@/lib/models/groups';
import { AppError, AppResponse } from '@/lib/utils/api';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

function extract(req: NextApiRequest, field: string): string | undefined {
    const s = req.query[field];
    return s ? (Array.isArray(s) ? s[0] : s) : undefined;
}

async function validateGroupAccess(tx: SqlClient, session: Session, groupId: string): Promise<Group> {
    const group = await Group.fetch(tx, groupId);
    const isMember = group.members.map(m => m.id).includes(session.user.id);

    if (!session.user.admin && !isMember) {
        throw new Error('not member of group');
    }

    return group;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<AppResponse<{}> | AppError>
) {
    const session: Session | null = await getServerSession(req, res, authOptions);
    if (!session) {
        return res.status(401).json({ code: 401, msg: 'Unauthorized' });
    }

    const id = extract(req, 'groupid');
    if (!id) {
        return res.status(400).json({ code: 400, msg: "Bad Request - missing groupid query string" });
    }

    try {
        switch (req.method) {
            case 'POST':
                const addForm = await AddGroupMemberFormSchema.validate(req.body);
                await runDatabaseTx(async tx => {
                    const group = await validateGroupAccess(tx, session, id);
                    await group.addMember(tx, addForm.userId, addForm.username, 'owner');
                });

                res.status(201).json({ code: 201, data: {} })
                break;
            case 'DELETE':
                const delForm = await DelGroupMemberFormSchema.validate(req.body);
                await runDatabaseTx(async tx => {
                    const group = await validateGroupAccess(tx, session, id);
                    await group.removeMember(tx, delForm.userId);
                });

                res.status(200).json({ code: 200, data: {} })
                break;
            default:
                res.status(405).json({ code: 405, msg: 'Method Not Allowed' })
                break;
        }
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ code: 500, msg: 'Internal Server Error' });
    }
}