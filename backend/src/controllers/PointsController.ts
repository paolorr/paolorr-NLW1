import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
	async index(request: Request, response: Response) {
		const { city, state, items } = request.query;

		const parsedItems = String(items)
			.split(',')
			.map((item) => Number(item.trim()))
			.filter((item) => !isNaN(item));

		const points = await knex('points')
			.join('points_items', 'points.id', '=', 'points_items.point_id')
			.where((builder) => {
				// if (parsedItems && parsedItems.length) {
				builder.whereIn('points_items.item_id', parsedItems);
				//}
				if (city) {
					builder.where('city', String(city));
				}
				if (state) {
					builder.where('state', String(state));
				}
			})
			.distinct()
			.select('points.*');
		// .debug(true);

		const mappedPoints = points.map((point) => {
			const mappedPoint = {
				...point,
				image_url: `http://192.168.0.20:3333/uploads/${point.image}`,
			};

			delete mappedPoint.image;
			return mappedPoint;
		});

		return response.json(mappedPoints);
	}

	async show(request: Request, response: Response) {
		const { id } = request.params;

		const point = await knex('points').where('id', id).first();

		if (!point) {
			return response.status(400).json({ message: 'Point not found' });
		}

		const mappedPoint = {
			...point,
			image_url: `http://192.168.0.20:3333/uploads/${point.image}`,
		};

		delete mappedPoint.image;

		const items = await knex('items')
			.join('points_items', 'items.id', '=', 'points_items.item_id')
			.where('points_items.point_id', id)
			.select('items.title');

		return response.json({ ...mappedPoint, items });
	}

	async create(request: Request, response: Response) {
		const {
			name,
			email,
			whatsapp,
			latitude,
			longitude,
			city,
			state,
			items,
		} = request.body;

		const point = {
			image: request.file.filename,
			name,
			email,
			whatsapp,
			latitude,
			longitude,
			city,
			state,
		};

		const parsedItems = String(items)
			.split(',')
			.map((item) => Number(item.trim()))
			.filter((item) => !isNaN(item));

		const transaction = await knex.transaction();
		try {
			const insertedIds = await transaction('points').insert(point);

			const point_id = insertedIds[0];

			const pointsItems = parsedItems.map((item_id: number) => {
				return { item_id, point_id: point_id };
			});

			await transaction('points_items').insert(pointsItems);

			await transaction.commit();

			return response.json({ id: point_id, ...point });
		} catch (error) {
			console.log(error);
			await transaction.rollback();
			return response.json({ success: false });
		}
	}
}

export default PointsController;
