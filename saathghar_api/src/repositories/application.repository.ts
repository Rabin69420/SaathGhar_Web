import { ApplicationModel, IApplication } from "../models/application.model";

export interface IApplicationRepository {
    create(data: Partial<IApplication>): Promise<IApplication>;
    findById(id: string): Promise<IApplication | null>;
    findByListing(listingId: string): Promise<IApplication[]>;
    findByApplicant(applicantId: string): Promise<IApplication[]>;
    updateStatus(id: string, status: string): Promise<IApplication | null>;
    delete(id: string): Promise<boolean>;
}

export class ApplicationMongoRepository implements IApplicationRepository {
    async create(data: Partial<IApplication>): Promise<IApplication> {
        const created = await ApplicationModel.create(data);
        return created.populate([
            { path: "applicant", select: "fullName username email phoneNumber imageUrl preferences" },
            { path: "listing", select: "title location rent image owner" }
        ]);
    }

    async findById(id: string): Promise<IApplication | null> {
        return ApplicationModel.findById(id)
            .populate("applicant", "fullName username email phoneNumber imageUrl preferences")
            .populate({ path: "listing", select: "title location rent image owner", populate: { path: "owner", select: "fullName username email" } });
    }

    async findByListing(listingId: string): Promise<IApplication[]> {
        return ApplicationModel.find({ listing: listingId })
            .populate("applicant", "fullName username email phoneNumber imageUrl preferences")
            .populate("listing", "title location rent image owner")
            .sort({ createdAt: -1 });
    }

    async findByApplicant(applicantId: string): Promise<IApplication[]> {
        return ApplicationModel.find({ applicant: applicantId })
            .populate("applicant", "fullName username email phoneNumber imageUrl")
            .populate({ path: "listing", select: "title location rent image owner", populate: { path: "owner", select: "fullName username email" } })
            .sort({ createdAt: -1 });
    }

    async updateStatus(id: string, status: string): Promise<IApplication | null> {
        return ApplicationModel.findByIdAndUpdate(id, { status }, { new: true })
            .populate("applicant", "fullName username email phoneNumber imageUrl preferences")
            .populate("listing", "title location rent image owner");
    }

    async delete(id: string): Promise<boolean> {
        const deleted = await ApplicationModel.findByIdAndDelete(id);
        return !!deleted;
    }

    async findAll(): Promise<IApplication[]> {
        return ApplicationModel.find()
            .populate("applicant", "fullName username email")
            .populate("listing", "title location rent owner")
            .sort({ createdAt: -1 });
    }
}
