import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Election {
    @Prop({ required: true })
    admin_name: string;

    @Prop({ required: true })
    member_id: number;
}

export const ElectionSchema = SchemaFactory.createForClass(Election);