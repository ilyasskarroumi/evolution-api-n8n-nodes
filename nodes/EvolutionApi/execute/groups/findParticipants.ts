import {
	IExecuteFunctions,
	IRequestOptions,
	IHttpRequestMethods,
	NodeOperationError,
} from 'n8n-workflow';
import { evolutionRequest } from '../evolutionRequest';

export async function findParticipants(ef: IExecuteFunctions) {
	try {
		const instanceName = ef.getNodeParameter('instanceName', 0) as string;
		const groupJid = ef.getNodeParameter('groupJid', 0) as string;

		const requestOptions: IRequestOptions = {
			method: 'GET' as IHttpRequestMethods,
			uri: `/group/participants/${instanceName}?groupJid=${groupJid}`,
			json: true,
		};

		const response = await evolutionRequest(ef, requestOptions);
		return {
			json: {
				success: true,
				data: response,
			},
		};
	} catch (error) {
		const errorData = {
			success: false,
			error: {
				message: error.message,
				details: 'Error fetching group participants',
				code: error.code || 'UNKNOWN_ERROR',
				timestamp: new Date().toISOString(),
			},
		};

		if (!ef.continueOnFail()) {
			throw new NodeOperationError(ef.getNode(), error.message, {
				message: errorData.error.message,
				description: errorData.error.details,
			});
		}

		return {
			json: errorData,
			error: errorData,
		};
	}
}
