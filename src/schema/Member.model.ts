// member Schame

import mongoose, {Schema} from 'mongoose';
import { MemberType, MemberStatus} from '../libs/enums/member.enum';

// Biz qurayotgan usul --- Schema first
// Ikkinchi usul --- Code first


const memberSchema = new Schema ({
   memberType: {
    type: String,
    enum: MemberType,
    default: MemberType.USER
   },
   
   memberStatus: {
    type: String,
    enum: MemberStatus,
    default: MemberStatus.ACTIVE
  },

  memberNick: {
    type: String,
    index: {unique: true, sparse: true},   // nicknameni takrorlanmas qiladi. Ya'ni databasega oldin yozilgan nickname takrorlansa ERROR beradi
    required: true             // ma'lumotni kiritishini majburiy qiladi   
  },                            // by default holatida (requiered:false) bo'ladi

  memberPhone: {
    type: String,
    index: {unique: true, sparse: true},
    required: true 
  },

  memberPassword: {
    type: String,
    select: true,    // database by defualt olib bermasin
    required: true
  },

  memberAddres: {
    type: String
  },

    memberDisc: {
    type: String
  },

    memberImage: {
    type: String
  },

    memberPoints: {
    type: Number,
    default: 0,
  },

},

{ timestamps: true}     //createdAt va updatedAt ma'lumotlarini 
                       // databasega avtomatic tushirib beradi

);

export default mongoose.model('Member', memberSchema);