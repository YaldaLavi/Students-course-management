import { Pool } from 'pg';
import path from 'path';
import dotenv from 'dotenv';
const { v4: uuidv4 } = require('uuid')

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const user = process.env.POSTGRES_USER;
const password = process.env.POSTGRES_PASSWORD;

const pool = new Pool({
  connectionString: `postgres://${user}:${password}@trumpet.db.elephantsql.com/${user}`,
});

type Result = {
  id: number,
  user_id: number,
  email: string,
  first_name: string,
  last_name:string,
  Role:string,
  mob_id:number,
  course_id:number,
  bio:string,
  linkedin:string,
  github:string
};

type WeekendTest = {
  id: number,
  name: string,
  repo_name: string,
  repo_url: string,
  course_ids: number[],
  ongoing: boolean
};

type Student = {
  id: number,
  finished_tests: string[],
  notes: string[],
};

type Course = {
  id: number,
  name: string,
};

type Topic = {
  id: number,
  week_topic:string[],
  week_number:number
};

type MobUsers = {
  id: number,
  user_id: number,
  email: string,
  first_name: string,
  last_name:string,
  Role:string,
  mob_name: string,
  mob_id: number,
  name: string,
};

type CoursesUsers = {
  id: number,
  email: string,
  first_name: string,
  last_name:string,
  Role:string,
  mob_id:number,
  course_id:number,
  name:string
};

type PreviousTest = {
  id: number,
  user_id: number,
  test_id: number,
  feedback: string,
  result: string
}

type PreviousTestUser = {
  id: number,
  uuid: string,
  name: string,
  user_id: number,
  test_id: number,
  feedback: string,
  result: string
}

type UserFeedback = {
  id: number,
  user_id: number,
  test_id: number,
  feedback: string,
  result: string
}

type UpdatedFeedback = {
  feedback: string,
  result: string
}

const getAllUsers = async () => {
  const client = await pool.connect();
  const result:{ rowCount: number, rows: Result[] } = await client.query('SELECT * FROM "SaltDB"."Users"');
  if (result.rowCount === 0) {
    return [];
  }
  client.release();
  const { rows } = result;
  return rows.map(row => {
    const userRow : Result = {
      id: row.id as number,
      user_id: row.user_id as number,
      email: row.email as string,
      first_name: row.first_name as string,
      last_name: row.last_name as string,
      Role: row.Role as string,
      mob_id: row.mob_id as number,
      course_id: row.course_id as number,
      bio: row.bio as string,
      linkedin: row.linkedin as string,
      github: row.github as string,
    };
    return userRow;
  });
};

const getAllWeekendTest = async () => {
  const client = await pool.connect();
  const result:{ rowCount: number, rows: WeekendTest[] } = await client.query('SELECT * FROM "SaltDB"."WeekendTests"');
  if (result.rowCount === 0) {
    return [];
  }
  client.release();
  const { rows } = result;
  return rows.map(row => {
    const weekendTestRow : WeekendTest = {
      id: row.id as number,
      name: row.name as string,
      repo_name: row.repo_name as string,
      repo_url: row.repo_url as string,
      course_ids: row.course_ids as number[],
      ongoing: row.ongoing as boolean
    };
    return weekendTestRow;
  });
};

const getAllStudents = async () => {
  const client = await pool.connect();
  const result:{ rowCount: number, rows: Student[] } = await client.query('SELECT * FROM "SaltDB"."Students"');
  if (result.rowCount === 0) {
    return [];
  }
  client.release();
  const { rows } = result;
  return rows.map(row => {
    const studentsRow : Student = {
      id: row.id as number,
      finished_tests: row.finished_tests as string[],
      notes: row.notes as string[],
    };
    return studentsRow;
  });
};

const getAllCourses = async () => {
  const client = await pool.connect();
  const result:{ rowCount: number, rows: Course[] } = await client.query('SELECT * FROM "SaltDB"."Courses"');
  if (result.rowCount === 0) {
    return [];
  }
  client.release();
  const { rows } = result;
  return rows.map(row => {
    const coursesRow : Course = {
      id: row.id as number,
      name: row.name as string,
    };
    return coursesRow;
  });
};

const findCoursesById = async (courseId:string) => {
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM "SaltDB"."Users" FULL OUTER JOIN "SaltDB"."Courses" ON "SaltDB"."Courses"."id" = "SaltDB"."Users"."course_id" WHERE course_id=$1', [courseId]);
  if (result.rowCount === 0) {
    return undefined;
  }
  client.release();
  const { rows } = result;
  return rows.map(row => {
    const courseUserRows : CoursesUsers = {
      id: row.id as number,
      email: row.email as string,
      first_name: row.first_name as string,
      last_name: row.last_name as string,
      Role: row.Role as string,
      mob_id: row.mob_id as number,
      course_id: row.course_id as number,
      name: row.name as string,
    };
    return courseUserRows;
  });
};

const findUsersByMobId = async (mobId:string) => {
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM "SaltDB"."Users" FULL OUTER JOIN "SaltDB"."Mob" ON "SaltDB"."Mob"."id" = "SaltDB"."Users"."mob_id" WHERE mob_id=$1', [mobId]);
  if (result.rowCount === 0) {
    return undefined;
  }
  client.release();
  const { rows } = result;
  return rows.map(row => {
    const mobRows : MobUsers = {
      id: row.id as number,
      user_id: row.user_id as number,
      email: row.email as string,
      first_name: row.first_name as string,
      last_name: row.last_name as string,
      Role: row.Role as string,
      mob_id: row.mob_id as number,
      mob_name: row.mob_name as string,
      name: row.name as string,
    };
    return mobRows;
  });
};

const findTestByCourseId = async (courseId: string) => {
  const client = await pool.connect();
  const result:{ rowCount: number, rows: WeekendTest[] } = await client.query(`SELECT * FROM "SaltDB"."WeekendTests" WHERE $1 = ANY(course_ids);`, [courseId]);
  if (result.rowCount === 0) {
    return [];
  }
  client.release();
  const { rows } = result;
  return rows.map(row => {
    const weekendTestRow : WeekendTest = {
      id: row.id as number,
      name: row.name as string,
      repo_name: row.repo_name as string,
      repo_url: row.repo_url as string,
      course_ids: row.course_ids as number[],
      ongoing: row.ongoing as boolean,
    };
    return weekendTestRow;
  });
};

const findTestById = async (id: string) => {
  const client = await pool.connect();
  const result:{ rowCount: number, rows: WeekendTest[] } = await client.query(`SELECT * FROM "SaltDB"."WeekendTests" WHERE id = $1`, [id]);
  if (result.rowCount === 0) {
    return [];
  }
  client.release();
  const { rows } = result;
  return rows.map(row => {
    const weekendTestRow : WeekendTest = {
      id: row.id as number,
      name: row.name as string,
      repo_name: row.repo_name as string,
      repo_url: row.repo_url as string,
      course_ids: row.course_ids as number[],
      ongoing: row.ongoing as boolean,
    };
    return weekendTestRow;
  });
};

const findPreviousTestsById = async (userId: string) => {
  const client = await pool.connect();
  // const result:{ rowCount: number, rows: PreviousTest[] } = await client.query(`SELECT * FROM "SaltDB"."TestFeedbacks" WHERE user_id=$1`, [Number(userId)]);
  const result:{ rowCount: number, rows: PreviousTestUser[] } = await client.query(`SELECT "SaltDB"."TestFeedbacks".id as uuid, * FROM "SaltDB"."TestFeedbacks" INNER JOIN "SaltDB"."WeekendTests" ON "SaltDB"."TestFeedbacks".test_id="SaltDB"."WeekendTests".id WHERE "SaltDB"."TestFeedbacks".user_id = $1`, [userId]);
  if (result.rowCount === 0) {
    return [];
  }
  client.release();
  const { rows } = result;
  return rows.map(row => {
    const testFeedbackRow : PreviousTestUser = {
      id: row.id as number,
      uuid: row.uuid as string,
      name: row.name as string,
      user_id: row.user_id as number,
      test_id: row.test_id as number,
      feedback: row.feedback as string,
      result: row.result as string
    };
    return testFeedbackRow;
  })
};



const UpdateUsersByUserId = async (
  UserId:string,
  userBio:string,
  userLinkedin:string,
  userGithub:string,
) => {
  const client = await pool.connect();
  const result = await client.query('UPDATE "SaltDB"."Users" SET "bio" = $2, "linkedin" = $3, "github" = $4 WHERE id=$1', [UserId, userBio, userLinkedin, userGithub]);
  console.log('result:', result);
  if (result.rowCount !== 1) {
    client.release();
    return null;
  }
  return true;
};

const getAllTopics = async () => {
  const client = await pool.connect();
  const result:{ rowCount: number, rows: Topic[] } = await client.query('SELECT * FROM "SaltDB"."WeekTopic"');
  if (result.rowCount === 0) {
    return [];
  }
  client.release();
  const { rows } = result;
  return rows.map(row => {
    const coursesRow : Topic = {
      id: row.id as number,
      week_topic: row.week_topic as string[],
      week_number: row.week_number as number,
    };
    return coursesRow;
  });
};

const getAllUserDetails = async () => {
  const client = await pool.connect();
  const result:{ rowCount: number, rows: MobUsers[] } =
    await client.query(`SELECT "SaltDB"."Users".id as user_id, * FROM "SaltDB"."Users"
      INNER JOIN "SaltDB"."Mob"
      ON "SaltDB"."Users".mob_id = "SaltDB"."Mob".id
      INNER JOIN "SaltDB"."Courses"
      ON "SaltDB"."Users".course_id = "SaltDB"."Courses".id
      WHERE "SaltDB"."Users"."Role" = 's'`
      );

  if (result.rowCount === 0) {
    return [];
  }
  client.release();
  const { rows } = result;
  return rows.map(row => {
    const mobRows : MobUsers = {
      id: row.id as number,
      user_id: row.user_id as number,
      email: row.email as string,
      first_name: row.first_name as string,
      last_name: row.last_name as string,
      Role: row.Role as string,
      mob_id: row.mob_id as number,
      mob_name: row.mob_name as string,
      name: row.name as string
    };
    return mobRows;
  });
};

const getUserDetailsByEmail = async (email: string) => {
  const client = await pool.connect();
  const result:{ rowCount: number, rows: MobUsers[] } =
    await client.query(`SELECT * FROM "SaltDB"."Users"
      INNER JOIN "SaltDB"."Mob"
      ON "SaltDB"."Users".mob_id = "SaltDB"."Mob".id
      INNER JOIN "SaltDB"."Courses"
      ON "SaltDB"."Users".course_id = "SaltDB"."Courses".id
      WHERE "SaltDB"."Users".email = $1`, [email]
      );

  if (result.rowCount === 0) {
    return [];
  }
  client.release();
  const { rows } = result;
  return rows.map(row => {
    const mobRows : MobUsers = {
      id: row.id as number,
      user_id: row.id as number,
      email: row.email as string,
      first_name: row.first_name as string,
      last_name: row.last_name as string,
      Role: row.Role as string,
      mob_id: row.mob_id as number,
      mob_name: row.mob_name as string,
      name: row.name as string
    };
    return mobRows;
  });
};

const postNewFeedback = async (data: UserFeedback) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO "SaltDB"."TestFeedbacks" (id, user_id, test_id, feedback, result) VALUES ('${uuidv4()}', $1, $2, $3, $4)`,
      [data.user_id, data.test_id, data.feedback, data.result]
    );
    client.release();
  } catch (err) {
    console.log('Error:', err);
  }
}

const updateFeedback = async (id: string, data: UpdatedFeedback) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `UPDATE "SaltDB"."TestFeedbacks"
      SET feedback = $1, result = $2
      WHERE id = '${id}'`,
      [data.feedback, data.result]
    );
    client.release();
  } catch (err) {
    console.log('Error:', err);
  }
}

const deleteFeedback = async (id: string) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `DELETE FROM "SaltDB"."TestFeedbacks"
      WHERE id = '${id}'`
    );
    client.release();
  } catch (err) {
    console.log('Error:', err);
  }
}

// pool.query('SELECT * FROM "SaltDB"."Users" FULL OUTER
// JOIN "SaltDB"."Mob" ON "SaltDB"."Mob"."id" = "SaltDB"."Users"."mob_id"', (err, res) => {
//   if (err) {
//     console.log('mob', err);
//   } else {
//     console.log('mobs', res);
//   }
// });

export default {
  getAllUsers,
  getAllWeekendTest,
  getAllStudents,
  getAllCourses,
  findUsersByMobId,
  findCoursesById,
  findTestById,
  findTestByCourseId,
  findPreviousTestsById,
  getAllUserDetails,
  getUserDetailsByEmail,
  postNewFeedback,
  updateFeedback,
  deleteFeedback,
  UpdateUsersByUserId,
  getAllTopics,
};
