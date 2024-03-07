-- Enable RLS on all table
ALTER TABLE "profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "course" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "course_password" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "course_enrollment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "assignment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_assignment_data" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "activity" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_activity_data" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tracelog_file" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "activity_reading_file" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "highlight" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "annotation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "activity_reading" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "question" ENABLE ROW LEVEL SECURITY;

-- profile
CREATE POLICY "Authenticated users can SELECT profile" ON "public"."profile"
FOR SELECT
TO rls_user
USING (auth.jwt() ->> 'role' = 'authenticated');

CREATE POLICY "Authenticated users can INSERT profile, only their own" ON "public"."profile"
FOR INSERT
TO rls_user
WITH CHECK (auth.jwt() ->> 'role' = 'authenticated' AND (auth.jwt() ->> 'sub')::uuid = id);

CREATE POLICY "Authenticated users can UPDATE profile, only their own" ON "public"."profile"
FOR UPDATE
TO rls_user
USING (auth.jwt() ->> 'role' = 'authenticated' AND (auth.jwt() ->> 'sub')::uuid = id);

CREATE POLICY "Authenticated users can DELETE profile, only their own" ON "public"."profile"
FOR DELETE
TO rls_user
USING (auth.jwt() ->> 'role' = 'authenticated' AND (auth.jwt() ->> 'sub')::uuid = id);

-- course
CREATE POLICY "Authenticated users can SELECT course, only if they are enrolled" ON "public"."course"
FOR SELECT
TO rls_user
USING (auth.jwt() ->> 'role' = 'authenticated' AND (SELECT EXISTS (SELECT "studentId" from course_enrollment WHERE "studentId" = (auth.jwt() ->> 'sub')::uuid)));

CREATE POLICY "Authenticated users can INSERT course" ON "public"."course"
FOR INSERT
TO rls_user
WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');

CREATE POLICY "Authenticated users can UPDATE course, only if they are the owner" ON "public"."course"
FOR UPDATE
TO rls_user
USING (auth.jwt() ->> 'role' = 'authenticated' AND (auth.jwt() ->> 'sub')::uuid = "teacherId");

CREATE POLICY "Authenticated users can DELETE course, only if they are the owner" ON "public"."course"
FOR DELETE
TO rls_user
USING (auth.jwt() ->> 'role' = 'authenticated' AND (auth.jwt() ->> 'sub')::uuid = "teacherId");

-- course_password
CREATE POLICY "Authenticated users can SELECT course_password" ON "public"."course_password"
FOR SELECT
TO rls_user
USING (auth.jwt() ->> 'role' = 'authenticated');

CREATE POLICY "Authenticated users can INSERT course_password" ON "public"."course_password"
FOR INSERT
TO rls_user
WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');

CREATE POLICY "Authenticated users can UPDATE course_password" ON "public"."course_password"
FOR UPDATE
TO rls_user
USING (auth.jwt() ->> 'role' = 'authenticated');

CREATE POLICY "Authenticated users can DELETE course_password" ON "public"."course_password"
FOR DELETE
TO rls_user
USING (auth.jwt() ->> 'role' = 'authenticated');

-- course_enrollment
CREATE POLICY "Authenticated users can SELECT course_enrollment" ON "public"."course_enrollment"
FOR SELECT
TO rls_user
USING (auth.jwt() ->> 'role' = 'authenticated');

CREATE POLICY "Authenticated users can INSERT course_enrollment, only if they are the owner" ON "public"."course_enrollment"
FOR INSERT
TO rls_user
WITH CHECK (auth.jwt() ->> 'role' = 'authenticated' AND (auth.jwt() ->> 'sub')::uuid = "studentId");

CREATE POLICY "Authenticated users can UPDATE course_enrollment, only if they are the owner" ON "public"."course_enrollment"
FOR UPDATE
TO rls_user
USING (auth.jwt() ->> 'role' = 'authenticated' AND (auth.jwt() ->> 'sub')::uuid = "studentId");

CREATE POLICY "Authenticated users can DELETE course_enrollment, only if they are the owner" ON "public"."course_enrollment"
FOR DELETE
TO rls_user
USING (auth.jwt() ->> 'role' = 'authenticated' AND (auth.jwt() ->> 'sub')::uuid = "studentId");

-- assignment
CREATE POLICY "Authenticated users can SELECT assignment" ON "public"."assignment"
FOR SELECT
TO rls_user
USING (
    auth.jwt() ->> 'role' = 'authenticated'
);

CREATE POLICY "Authenticated users can INSERT assignment" ON "public"."assignment"
FOR INSERT
TO rls_user
WITH CHECK (
    auth.jwt() ->> 'role' = 'authenticated'
);

-- Needs to be changed to only allow the teacher to insert
CREATE POLICY "Authenticated users can UPDATE assignment, if they are the owner" ON "public"."assignment"
FOR UPDATE
TO rls_user
WITH CHECK (
    auth.jwt() ->> 'role' = 'authenticated'
);

-- Needs to be changed to only allow the teacher to delete
CREATE POLICY "Authenticated users can DELETE assignment, if they are the owner" ON "public"."assignment"
FOR DELETE
TO rls_user
USING (
    auth.jwt() ->> 'role' = 'authenticated'
);

-- user_assignment_data
CREATE POLICY "Authenticated users can SELECT user_assignment_data" ON "public"."user_assignment_data"
FOR SELECT
TO rls_user
USING (
    auth.jwt() ->> 'role' = 'authenticated'
);

CREATE POLICY "Authenticated users can INSERT user_assignment_data" ON "public"."user_assignment_data"
FOR INSERT
TO rls_user
WITH CHECK (
    auth.jwt() ->> 'role' = 'authenticated'
);

CREATE POLICY "Authenticated users can UPDATE user_assignment_data" ON "public"."user_assignment_data"
FOR UPDATE
TO rls_user
USING (
    auth.jwt() ->> 'role' = 'authenticated'
);

CREATE POLICY "Authenticated users can DELETE user_assignment_data" ON "public"."user_assignment_data"
FOR DELETE
TO rls_user
USING (
    auth.jwt() ->> 'role' = 'authenticated'
);

-- activity
CREATE POLICY "Authenticated users can SELECT activity" ON "public"."activity"
FOR SELECT
TO rls_user
USING (
    auth.jwt() ->> 'role' = 'authenticated'
);

CREATE POLICY "Authenticated users can INSERT activity" ON "public"."activity"
FOR INSERT
TO rls_user
WITH CHECK (
    auth.jwt() ->> 'role' = 'authenticated'
);

CREATE POLICY "Authenticated users can UPDATE activity" ON "public"."activity"
FOR UPDATE
TO rls_user
USING (
    auth.jwt() ->> 'role' = 'authenticated'
);

CREATE POLICY "Authenticated users can DELETE activity" ON "public"."activity"
FOR DELETE
TO rls_user
USING (
    auth.jwt() ->> 'role' = 'authenticated'
);

-- user_activity_data
CREATE POLICY "Authenticated users can SELECT user_activity_data" ON "public"."user_activity_data"
FOR SELECT
TO rls_user
USING (
    auth.jwt() ->> 'role' = 'authenticated'
);

CREATE POLICY "Authenticated users can INSERT user_activity_data" ON "public"."user_activity_data"
FOR INSERT
TO rls_user
WITH CHECK (
    auth.jwt() ->> 'role' = 'authenticated'
);

CREATE POLICY "Authenticated users can UPDATE user_activity_data" ON "public"."user_activity_data"
FOR UPDATE
TO rls_user
USING (
    auth.jwt() ->> 'role' = 'authenticated'
);

CREATE POLICY "Authenticated users can DELETE user_activity_data" ON "public"."user_activity_data"
FOR DELETE
TO rls_user
USING (
    auth.jwt() ->> 'role' = 'authenticated'
);

-- tracelog_file
CREATE POLICY "Authenticated users can SELECT tracelog_file" ON "public"."tracelog_file"
FOR SELECT
TO rls_user
USING (
    auth.jwt() ->> 'role' = 'authenticated'
);

CREATE POLICY "Authenticated users can INSERT tracelog_file" ON "public"."tracelog_file"
FOR INSERT
TO rls_user
WITH CHECK (
    auth.jwt() ->> 'role' = 'authenticated'
);

CREATE POLICY "Authenticated users can UPDATE tracelog_file" ON "public"."tracelog_file"
FOR UPDATE
TO rls_user
USING (
    auth.jwt() ->> 'role' = 'authenticated'
);

CREATE POLICY "Authenticated users can DELETE tracelog_file" ON "public"."tracelog_file"
FOR DELETE
TO rls_user
USING (
    auth.jwt() ->> 'role' = 'authenticated'
);

-- activity_reading_file
CREATE POLICY "Authenticated users can SELECT activity_reading_file" ON "public"."activity_reading_file"
FOR SELECT
TO rls_user
USING (
    auth.jwt() ->> 'role' = 'authenticated'
);

CREATE POLICY "Authenticated users can INSERT activity_reading_file" ON "public"."activity_reading_file"
FOR INSERT
TO rls_user
WITH CHECK (
    auth.jwt() ->> 'role' = 'authenticated'
);

CREATE POLICY "Authenticated users can UPDATE activity_reading_file" ON "public"."activity_reading_file"
FOR UPDATE
TO rls_user
USING (
    auth.jwt() ->> 'role' = 'authenticated'
);

CREATE POLICY "Authenticated users can DELETE activity_reading_file" ON "public"."activity_reading_file"
FOR DELETE
TO rls_user
USING (
    auth.jwt() ->> 'role' = 'authenticated'
);

-- highlight
CREATE POLICY "Authenticated users can SELECT highlight" ON "public"."highlight"
FOR SELECT
TO rls_user
USING (
    auth.jwt() ->> 'role' = 'authenticated'
);

CREATE POLICY "Authenticated users can INSERT highlight" ON "public"."highlight"
FOR INSERT
TO rls_user
WITH CHECK (
    auth.jwt() ->> 'role' = 'authenticated'
);

CREATE POLICY "Authenticated users can UPDATE highlight" ON "public"."highlight"
FOR UPDATE
TO rls_user
USING (
    auth.jwt() ->> 'role' = 'authenticated'
);

CREATE POLICY "Authenticated users can DELETE highlight" ON "public"."highlight"
FOR DELETE
TO rls_user
USING (
    auth.jwt() ->> 'role' = 'authenticated'
);

-- annotation
CREATE POLICY "Authenticated users can SELECT annotation" ON "public"."annotation"
FOR SELECT
TO rls_user
USING (
    auth.jwt() ->> 'role' = 'authenticated'
);

CREATE POLICY "Authenticated users can INSERT annotation" ON "public"."annotation"
FOR INSERT
TO rls_user
WITH CHECK (
    auth.jwt() ->> 'role' = 'authenticated'
);

CREATE POLICY "Authenticated users can UPDATE annotation" ON "public"."annotation"
FOR UPDATE
TO rls_user
USING (
    auth.jwt() ->> 'role' = 'authenticated'
);

CREATE POLICY "Authenticated users can DELETE annotation" ON "public"."annotation"
FOR DELETE
TO rls_user
USING (
    auth.jwt() ->> 'role' = 'authenticated'
);

-- activity_reading
CREATE POLICY "Authenticated users can SELECT activity_reading" ON "public"."activity_reading"
FOR SELECT
TO rls_user
USING (
    auth.jwt() ->> 'role' = 'authenticated'
);

CREATE POLICY "Authenticated users can INSERT activity_reading" ON "public"."activity_reading"
FOR INSERT
TO rls_user
WITH CHECK (
    auth.jwt() ->> 'role' = 'authenticated'
);

CREATE POLICY "Authenticated users can UPDATE activity_reading" ON "public"."activity_reading"
FOR UPDATE
TO rls_user
USING (
    auth.jwt() ->> 'role' = 'authenticated'
);

CREATE POLICY "Authenticated users can DELETE activity_reading" ON "public"."activity_reading"
FOR DELETE
TO rls_user
USING (
    auth.jwt() ->> 'role' = 'authenticated'
);

-- question
CREATE POLICY "Authenticated users can SELECT question" ON "public"."question"
FOR SELECT
TO rls_user
USING (
    auth.jwt() ->> 'role' = 'authenticated'
);

CREATE POLICY "Authenticated users can INSERT question" ON "public"."question"
FOR INSERT
TO rls_user
WITH CHECK (
    auth.jwt() ->> 'role' = 'authenticated'
);

CREATE POLICY "Authenticated users can UPDATE question" ON "public"."question"
FOR UPDATE
TO rls_user
USING (
    auth.jwt() ->> 'role' = 'authenticated'
);

CREATE POLICY "Authenticated users can DELETE question" ON "public"."question"
FOR DELETE
TO rls_user
USING (
    auth.jwt() ->> 'role' = 'authenticated'
);

