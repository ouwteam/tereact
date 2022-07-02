import { Request, Response } from "express";
import { Contact } from "../models/contact.model";
import { User } from "../models/user.model";

export async function getListRoom(req: Request, res: Response) {
    if (!req.query.user_id) {
        return res.status(400).send({
            ok: false,
            message: "user_id is empty"
        });
    }

    const user_id: number = parseInt(req.query.user_id as string);
    const user: User | null = await User.findByPk(user_id);
    if (user == null) {
        return res.status(400).send({
            ok: false,
            message: "User not found"
        });
    }

    const rows = await Contact.findAll({
        where: {
            user_id: user.id
        }, include: [
            {
                model: User.scope("withoutPassword"),
                as: "user",
            },
        ]
    });

    return res.send({
        ok: true,
        data: {
            contacts: rows
        }
    });
}

export async function getDetail(req: Request, res: Response) {
    if (!req.query.user_id) {
        return res.status(400).send({
            ok: false,
            message: "user_id is empty"
        });
    }

    const user_id: number = parseInt(req.query.user_id as string);
    const contact = await Contact.findOne({
        where: {
            user_id: user_id,
            id: req.params.contact_id
        },
        include: [
            {
                model: User.scope("withoutPassword"),
                as: "user",
            },
        ]
    });

    return res.send({
        ok: true,
        data: {
            contact: contact
        }
    });
}

export async function deleteContact(req: Request, res: Response) {
    if (!req.query.user_id) {
        return res.status(400).send({
            ok: false,
            message: "user_id is empty"
        });
    }

    const user_id: number = parseInt(req.query.user_id as string);
    try {
        await Contact.destroy({
            where: {
                user_id: user_id,
                id: req.params.contact_id,
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(400).send({
            ok: false,
            data: {},
            message: "Delete contact failed"
        });
    }

    return res.send({
        ok: true,
        data: {},
        message: "Contact deleted"
    });
}

export async function addContact(req: Request, res: Response) {
    if (!req.body.user_id) {
        return res.status(400).send({
            ok: false,
            message: "user_id is empty"
        });
    }

    if (!req.body.guest_id) {
        return res.status(400).send({
            ok: false,
            message: "guest_id is empty"
        });
    }

    const user_id = req.body.user_id;
    const guest_id = req.body.guest_id;
    const rows = await Contact.count({where: { user_id: user_id, guest_id: guest_id }});
    if(rows > 0) {
        return res.status(400).send({
            ok: false,
            message: "User is already in your contact"
        });
    }

    var contact: Contact;
    try {
        contact = await Contact.create({
            user_id: user_id,
            guest_id: guest_id,
            alias: req.body.alias || null
        });
    } catch (error) {
        console.error(error);
        return res.status(400).send({
            ok: false,
            data: {},
            message: "Add contact failed"
        });
    }

    return res.send({
        ok: true,
        data: {
            contact: contact,
            user: await contact.getUser({scope: ['withoutPassword']})
        },
    });
}